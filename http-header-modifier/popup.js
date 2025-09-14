let isEnabled = false;
let headers = {};

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupEventListeners();
});

function loadSettings() {
  chrome.storage.sync.get(['enabled', 'headers'], (result) => {
    isEnabled = result.enabled || false;
    headers = result.headers || {};
    
    updateUI();
    renderHeaders();
  });
}

function updateUI() {
  const enableSwitch = document.getElementById('enableSwitch');
  const statusText = document.getElementById('statusText');
  
  enableSwitch.checked = isEnabled;
  statusText.textContent = isEnabled ? '开启' : '关闭';
  statusText.className = isEnabled ? 'status-text active' : 'status-text';
  
  document.body.classList.toggle('enabled', isEnabled);
}

function renderHeaders() {
  const headersList = document.getElementById('headersList');
  headersList.innerHTML = '';
  
  Object.entries(headers).forEach(([name, value]) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="header-name" value="${escapeHtml(name)}" data-original="${escapeHtml(name)}"></td>
      <td><input type="text" class="header-value" value="${escapeHtml(value)}"></td>
      <td>
        <button class="btn-delete" data-name="${escapeHtml(name)}">删除</button>
      </td>
    `;
    headersList.appendChild(row);
  });
  
  if (Object.keys(headers).length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="3" class="empty-message">暂无自定义请求头</td>';
    headersList.appendChild(row);
  }
}

function setupEventListeners() {
  document.getElementById('enableSwitch').addEventListener('change', (e) => {
    isEnabled = e.target.checked;
    chrome.storage.sync.set({ enabled: isEnabled });
    updateUI();
    showNotification(isEnabled ? '插件已开启' : '插件已关闭');
  });
  
  document.getElementById('addHeaderBtn').addEventListener('click', addHeader);
  
  document.getElementById('newHeaderName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('newHeaderValue').focus();
    }
  });
  
  document.getElementById('newHeaderValue').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addHeader();
    }
  });
  
  document.getElementById('saveBtn').addEventListener('click', saveHeaders);
  document.getElementById('resetBtn').addEventListener('click', resetAll);
  document.getElementById('exportBtn').addEventListener('click', exportConfig);
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  
  document.getElementById('importFile').addEventListener('change', importConfig);
  
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = e.target.dataset.name;
      const value = e.target.dataset.value;
      document.getElementById('newHeaderName').value = name;
      document.getElementById('newHeaderValue').value = value;
    });
  });
  
  document.getElementById('headersList').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
      const name = e.target.dataset.name;
      delete headers[name];
      chrome.storage.sync.set({ headers });
      renderHeaders();
      showNotification('请求头已删除');
    }
  });
  
  document.getElementById('headersList').addEventListener('change', (e) => {
    if (e.target.classList.contains('header-name') || e.target.classList.contains('header-value')) {
      const row = e.target.closest('tr');
      const nameInput = row.querySelector('.header-name');
      const valueInput = row.querySelector('.header-value');
      const originalName = nameInput.dataset.original;
      
      if (originalName !== nameInput.value) {
        delete headers[originalName];
      }
      
      headers[nameInput.value] = valueInput.value;
      nameInput.dataset.original = nameInput.value;
    }
  });
}

function addHeader() {
  const nameInput = document.getElementById('newHeaderName');
  const valueInput = document.getElementById('newHeaderValue');
  
  const name = nameInput.value.trim();
  const value = valueInput.value.trim();
  
  if (!name) {
    showNotification('请输入头字段名', 'error');
    return;
  }
  
  headers[name] = value;
  chrome.storage.sync.set({ headers });
  
  nameInput.value = '';
  valueInput.value = '';
  nameInput.focus();
  
  renderHeaders();
  showNotification('请求头已添加');
}

function saveHeaders() {
  const rows = document.querySelectorAll('#headersList tr');
  const newHeaders = {};
  
  rows.forEach(row => {
    const nameInput = row.querySelector('.header-name');
    const valueInput = row.querySelector('.header-value');
    
    if (nameInput && valueInput) {
      const name = nameInput.value.trim();
      const value = valueInput.value.trim();
      
      if (name) {
        newHeaders[name] = value;
      }
    }
  });
  
  headers = newHeaders;
  chrome.storage.sync.set({ headers });
  renderHeaders();
  showNotification('配置已保存');
}

function resetAll() {
  if (confirm('确定要重置所有配置吗？')) {
    headers = {};
    isEnabled = false;
    chrome.storage.sync.set({ headers, enabled: false });
    updateUI();
    renderHeaders();
    showNotification('配置已重置');
  }
}

function exportConfig() {
  const config = {
    enabled: isEnabled,
    headers: headers
  };
  
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'header-modifier-config.json';
  a.click();
  URL.revokeObjectURL(url);
  
  showNotification('配置已导出');
}

function importConfig(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const config = JSON.parse(event.target.result);
      
      if (config.headers && typeof config.headers === 'object') {
        headers = config.headers;
        isEnabled = config.enabled || false;
        
        chrome.storage.sync.set({ headers, enabled: isEnabled });
        updateUI();
        renderHeaders();
        showNotification('配置已导入');
      } else {
        showNotification('配置文件格式错误', 'error');
      }
    } catch (error) {
      showNotification('导入失败：' + error.message, 'error');
    }
  };
  
  reader.readAsText(file);
  e.target.value = '';
}

function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type} show`;
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}