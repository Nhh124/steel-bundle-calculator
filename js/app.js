// State management
let currentSupplierId = "hoa_phat";
let currentDiameter = "D10";
let currentMode = "bars_to_bundle"; // 'bars_to_bundle' or 'bundle_to_bars'
let currentGrade = "cb4_5"; // 'cb4_5' or 'cb3'
let vehicleItems = [];

// DOM Elements
const supplierRadiosContainer = document.getElementById("supplier-radios");
const diameterBtnsContainer = document.getElementById("diameter-btns");
const gradeSelectorContainer = document.getElementById("grade-selector-container");
const gradeRadios = document.getElementsByName("steel-grade");

const inputBars = document.getElementById("input-bars");
const inputBundles = document.getElementById("input-bundles");
const inputOddBars = document.getElementById("input-odd-bars");

const sectionBarsToBundle = document.getElementById("section-bars-to-bundle");
const sectionBundleToBars = document.getElementById("section-bundle-to-bars");

const specBannerText = document.getElementById("spec-banner-text");
const resultHighlight = document.getElementById("result-highlight");
const resFullBundlesVal = document.getElementById("res-full-bundles-val");
const resOddBarsVal = document.getElementById("res-odd-bars-val");
const resTotalBarsVal = document.getElementById("res-total-bars-val");
const resEstWeightVal = document.getElementById("res-est-weight-val");

const btnCopyResult = document.getElementById("btn-copy-result");
const btnAddToVehicle = document.getElementById("btn-add-to-vehicle");
const vehicleTableBody = document.getElementById("vehicle-table-body");
const vehicleTotalCount = document.getElementById("vehicle-total-count");
const btnCopyVehicle = document.getElementById("btn-copy-vehicle");
const btnClearVehicle = document.getElementById("btn-clear-vehicle");
const toast = document.getElementById("toast");

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  renderSupplierRadios();
  renderDiameterButtons();
  setupEventListeners();
  calculate();
});

// Render Supplier Radio Cards
function renderSupplierRadios() {
  supplierRadiosContainer.innerHTML = "";
  
  Object.values(STEEL_SUPPLIERS).forEach((supplier) => {
    const isChecked = supplier.id === currentSupplierId;
    const item = document.createElement("label");
    item.className = "supplier-radio-item";
    item.innerHTML = `
      <input type="radio" name="supplier" value="${supplier.id}" ${isChecked ? "checked" : ""}>
      <div class="supplier-card">
        <div class="radio-indicator"></div>
        <div class="supplier-info">
          <div class="supplier-name">
            <span>${supplier.name}</span>
            <span class="supplier-badge" style="background-color: ${supplier.badgeColor}">${supplier.code}</span>
          </div>
          <div class="supplier-sub">${supplier.location}</div>
        </div>
      </div>
    `;
    supplierRadiosContainer.appendChild(item);
  });
}

// Render Diameter Buttons
function renderDiameterButtons() {
  const diameters = ["D10", "D12", "D14", "D16", "D18", "D20", "D22", "D25", "D28", "D32", "D36"];
  diameterBtnsContainer.innerHTML = "";
  
  const currentSupplier = STEEL_SUPPLIERS[currentSupplierId];
  
  diameters.forEach((d) => {
    const spec = currentSupplier.specs[d];
    const isAvailable = spec && spec.bundle !== null;
    const isActive = d === currentDiameter;
    
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `diameter-btn ${isActive ? "active" : ""}`;
    btn.disabled = !isAvailable;
    btn.textContent = d;
    if (!isAvailable) {
      btn.title = "Nhà cung cấp không có quy cách bó cho chủng loại này";
    }
    
    btn.addEventListener("click", () => {
      currentDiameter = d;
      renderDiameterButtons();
      updateGradeSelector();
      calculate();
    });
    
    diameterBtnsContainer.appendChild(btn);
  });
}

// Update Grade Selector visibility & options
function updateGradeSelector() {
  const supplier = STEEL_SUPPLIERS[currentSupplierId];
  const spec = supplier.specs[currentDiameter];
  
  if (spec && spec.cb3 !== null) {
    gradeSelectorContainer.style.display = "block";
    const labelCb3 = document.getElementById("label-grade-cb3");
    if (labelCb3) {
      labelCb3.textContent = `CB3 / SD295 / GR40 (${spec.cb3.toFixed(2)} kg/cây)`;
    }
    const labelCb4 = document.getElementById("label-grade-cb4");
    if (labelCb4) {
      labelCb4.textContent = `CB4 / CB5 (${spec.cb4_5.toFixed(2)} kg/cây)`;
    }
  } else {
    // If CB3 is not specifically defined, fall back to CB4/CB5
    currentGrade = "cb4_5";
    const radioCb4 = document.querySelector('input[name="steel-grade"][value="cb4_5"]');
    if (radioCb4) radioCb4.checked = true;
    gradeSelectorContainer.style.display = "none";
  }
}

// Event Listeners setup
function setupEventListeners() {
  // Supplier change
  supplierRadiosContainer.addEventListener("change", (e) => {
    if (e.target.name === "supplier") {
      currentSupplierId = e.target.value;
      const supplier = STEEL_SUPPLIERS[currentSupplierId];
      // Check if current diameter is valid for this supplier
      if (!supplier.specs[currentDiameter] || supplier.specs[currentDiameter].bundle === null) {
        // Find first available diameter
        for (const [d, spec] of Object.entries(supplier.specs)) {
          if (spec.bundle !== null) {
            currentDiameter = d;
            break;
          }
        }
      }
      renderDiameterButtons();
      updateGradeSelector();
      calculate();
    }
  });

  // Grade radio change
  gradeRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      currentGrade = e.target.value;
      calculate();
    });
  });

  // Mode tabs
  document.querySelectorAll(".mode-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".mode-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentMode = tab.dataset.mode;
      
      if (currentMode === "bars_to_bundle") {
        sectionBarsToBundle.style.display = "block";
        sectionBundleToBars.style.display = "none";
      } else {
        sectionBarsToBundle.style.display = "none";
        sectionBundleToBars.style.display = "block";
      }
      calculate();
    });
  });

  // Numeric inputs
  inputBars.addEventListener("input", calculate);
  inputBundles.addEventListener("input", calculate);
  inputOddBars.addEventListener("input", calculate);

  // Quick number buttons for input-bars
  document.querySelectorAll(".quick-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = parseInt(btn.dataset.val, 10);
      const current = parseInt(inputBars.value, 10) || 0;
      inputBars.value = current + val;
      calculate();
    });
  });

  // Copy result
  btnCopyResult.addEventListener("click", copyCurrentResult);

  // Add to vehicle trip
  btnAddToVehicle.addEventListener("click", addToVehicleTrip);

  // Copy vehicle list
  btnCopyVehicle.addEventListener("click", copyVehicleList);

  // Clear vehicle list
  btnClearVehicle.addEventListener("click", () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ danh sách chuyến xe?")) {
      vehicleItems = [];
      renderVehicleTable();
      showToast("Đã xóa danh sách chuyến xe!");
    }
  });
}

// Main Calculation Function
function calculate() {
  const supplier = STEEL_SUPPLIERS[currentSupplierId];
  const spec = supplier.specs[currentDiameter];
  
  if (!spec || spec.bundle === null) {
    specBannerText.innerHTML = `Chủng loại <strong>${currentDiameter}</strong> không có thông số bó của <strong>${supplier.name}</strong>.`;
    resultHighlight.innerHTML = `<span style="color:#f87171">Không có quy cách</span>`;
    resFullBundlesVal.textContent = "0";
    resOddBarsVal.textContent = "0";
    resTotalBarsVal.textContent = "0";
    resEstWeightVal.textContent = "0 kg";
    return;
  }

  const bundleSize = spec.bundle;
  const baremPerBar = (currentGrade === "cb3" && spec.cb3 !== null) ? spec.cb3 : spec.cb4_5;
  const gradeText = (currentGrade === "cb3" && spec.cb3 !== null) ? "CB3/GR40" : "CB4/CB5";

  // Update banner
  specBannerText.innerHTML = `Quy cách <strong>${supplier.name}</strong> - <strong>${currentDiameter}</strong>: <strong>${bundleSize} cây/bó</strong> | Barem: <strong>${baremPerBar.toFixed(2)} kg/cây</strong> (${gradeText})`;

  let totalBars = 0;
  let fullBundles = 0;
  let oddBars = 0;

  if (currentMode === "bars_to_bundle") {
    totalBars = Math.max(0, parseInt(inputBars.value, 10) || 0);
    fullBundles = Math.floor(totalBars / bundleSize);
    oddBars = totalBars % bundleSize;
  } else {
    fullBundles = Math.max(0, parseInt(inputBundles.value, 10) || 0);
    oddBars = Math.max(0, parseInt(inputOddBars.value, 10) || 0);
    totalBars = (fullBundles * bundleSize) + oddBars;
  }

  // Calculate estimated weight
  const totalWeightKg = totalBars * baremPerBar;
  const totalWeightTon = (totalWeightKg / 1000).toFixed(3);

  // Format Result Highlight
  if (totalBars === 0) {
    resultHighlight.innerHTML = `0 <span>bó</span> + 0`;
  } else if (oddBars === 0) {
    resultHighlight.innerHTML = `${fullBundles.toLocaleString()} <span>bó</span>`;
  } else {
    resultHighlight.innerHTML = `${fullBundles.toLocaleString()} <span>bó</span> + ${oddBars.toLocaleString()}`;
  }

  resFullBundlesVal.textContent = `${fullBundles.toLocaleString()} bó (= ${(fullBundles * bundleSize).toLocaleString()} cây)`;
  resOddBarsVal.textContent = `${oddBars.toLocaleString()} cây`;
  resTotalBarsVal.textContent = `${totalBars.toLocaleString()} cây`;
  resEstWeightVal.textContent = `${Math.round(totalWeightKg).toLocaleString()} kg (${totalWeightTon} tấn)`;
}

// Copy single result
function copyCurrentResult() {
  const supplier = STEEL_SUPPLIERS[currentSupplierId];
  const spec = supplier.specs[currentDiameter];
  if (!spec || spec.bundle === null) return;

  const bundleSize = spec.bundle;
  const baremPerBar = (currentGrade === "cb3" && spec.cb3 !== null) ? spec.cb3 : spec.cb4_5;
  const gradeText = (currentGrade === "cb3" && spec.cb3 !== null) ? "CB3" : "CB4/CB5";

  let totalBars = 0;
  let fullBundles = 0;
  let oddBars = 0;

  if (currentMode === "bars_to_bundle") {
    totalBars = Math.max(0, parseInt(inputBars.value, 10) || 0);
    fullBundles = Math.floor(totalBars / bundleSize);
    oddBars = totalBars % bundleSize;
  } else {
    fullBundles = Math.max(0, parseInt(inputBundles.value, 10) || 0);
    oddBars = Math.max(0, parseInt(inputOddBars.value, 10) || 0);
    totalBars = (fullBundles * bundleSize) + oddBars;
  }

  const totalWeightKg = Math.round(totalBars * baremPerBar);
  const resultText = `[CÂN XE] ${supplier.name} ${currentDiameter} (${gradeText})\n• Tổng cây: ${totalBars.toLocaleString()} cây\n• Quy đổi: ${fullBundles} bó + ${oddBars}\n• Khối lượng barem: ${totalWeightKg.toLocaleString()} kg (~${(totalWeightKg/1000).toFixed(3)} tấn)`;

  navigator.clipboard.writeText(resultText).then(() => {
    showToast("Đã sao chép kết quả vào bộ nhớ tạm!");
  }).catch(() => {
    showToast("Không thể sao chép tự động, vui lòng copy thủ công!");
  });
}

// Add to Vehicle Trip
function addToVehicleTrip() {
  const supplier = STEEL_SUPPLIERS[currentSupplierId];
  const spec = supplier.specs[currentDiameter];
  if (!spec || spec.bundle === null) return;

  const bundleSize = spec.bundle;
  const baremPerBar = (currentGrade === "cb3" && spec.cb3 !== null) ? spec.cb3 : spec.cb4_5;
  const gradeText = (currentGrade === "cb3" && spec.cb3 !== null) ? "CB3" : "CB4/CB5";

  let totalBars = 0;
  let fullBundles = 0;
  let oddBars = 0;

  if (currentMode === "bars_to_bundle") {
    totalBars = Math.max(0, parseInt(inputBars.value, 10) || 0);
    fullBundles = Math.floor(totalBars / bundleSize);
    oddBars = totalBars % bundleSize;
  } else {
    fullBundles = Math.max(0, parseInt(inputBundles.value, 10) || 0);
    oddBars = Math.max(0, parseInt(inputOddBars.value, 10) || 0);
    totalBars = (fullBundles * bundleSize) + oddBars;
  }

  if (totalBars <= 0) {
    showToast("Vui lòng nhập số cây lớn hơn 0!");
    return;
  }

  const weightKg = Math.round(totalBars * baremPerBar);

  vehicleItems.push({
    id: Date.now(),
    supplierName: supplier.name,
    supplierCode: supplier.code,
    diameter: currentDiameter,
    grade: gradeText,
    bundleSize: bundleSize,
    totalBars: totalBars,
    bundles: fullBundles,
    oddBars: oddBars,
    weightKg: weightKg
  });

  renderVehicleTable();
  showToast(`Đã thêm ${currentDiameter} (${totalBars} cây) vào chuyến xe!`);
}

// Render Vehicle Trip Table
function renderVehicleTable() {
  vehicleTableBody.innerHTML = "";
  vehicleTotalCount.textContent = vehicleItems.length;

  if (vehicleItems.length === 0) {
    vehicleTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#94a3b8; padding:20px;">Chưa có mặt hàng nào được thêm. Nhập số cây và bấm "Thêm vào danh sách chuyến xe".</td></tr>`;
    document.getElementById("vehicle-foot-row").style.display = "none";
    return;
  }

  document.getElementById("vehicle-foot-row").style.display = "table-row";

  let sumBars = 0;
  let sumBundles = 0;
  let sumOdd = 0;
  let sumWeight = 0;

  vehicleItems.forEach((item, index) => {
    sumBars += item.totalBars;
    sumBundles += item.bundles;
    sumOdd += item.oddBars;
    sumWeight += item.weightKg;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td><strong>${item.supplierCode}</strong> - ${item.diameter} <span style="font-size:0.75rem; color:#64748b;">(${item.grade})</span></td>
      <td><strong>${item.totalBars.toLocaleString()}</strong></td>
      <td><span style="color:#0284c7; font-weight:bold;">${item.bundles}</span> bó (${item.bundleSize} c/b)</td>
      <td><span style="color:#ea580c; font-weight:bold;">${item.oddBars}</span> cây</td>
      <td>${item.weightKg.toLocaleString()} kg</td>
      <td><button type="button" class="btn-del" onclick="deleteVehicleItem(${item.id})">Xóa</button></td>
    `;
    vehicleTableBody.appendChild(tr);
  });

  document.getElementById("foot-total-bars").textContent = sumBars.toLocaleString();
  document.getElementById("foot-total-bundles").textContent = `${sumBundles.toLocaleString()} bó`;
  document.getElementById("foot-total-odd").textContent = `${sumOdd.toLocaleString()} cây`;
  document.getElementById("foot-total-weight").textContent = `${sumWeight.toLocaleString()} kg (${(sumWeight/1000).toFixed(3)} tấn)`;
}

// Delete single vehicle item
window.deleteVehicleItem = function(id) {
  vehicleItems = vehicleItems.filter(item => item.id !== id);
  renderVehicleTable();
  showToast("Đã xóa mặt hàng khỏi danh sách!");
};

// Copy full vehicle list for Zalo
function copyVehicleList() {
  if (vehicleItems.length === 0) {
    showToast("Danh sách chuyến xe đang trống!");
    return;
  }

  let text = `DANH SÁCH THÉP CHUYẾN XE (${new Date().toLocaleDateString("vi-VN")}):\n`;
  let sumBars = 0;
  let sumBundles = 0;
  let sumOdd = 0;
  let sumWeight = 0;

  vehicleItems.forEach((item, i) => {
    sumBars += item.totalBars;
    sumBundles += item.bundles;
    sumOdd += item.oddBars;
    sumWeight += item.weightKg;
    text += `${i + 1}. ${item.supplierName} ${item.diameter} (${item.grade}): ${item.totalBars.toLocaleString()} cây = ${item.bundles} bó + ${item.oddBars} (~${item.weightKg.toLocaleString()} kg)\n`;
  });

  text += `--------------------------\n`;
  text += `TỔNG CỘNG: ${sumBars.toLocaleString()} cây | ${sumBundles} bó + ${sumOdd}\n`;
  text += `TỔNG BAREM: ${sumWeight.toLocaleString()} kg (~${(sumWeight/1000).toFixed(3)} tấn)`;

  navigator.clipboard.writeText(text).then(() => {
    showToast("Đã sao chép danh sách chuyến xe!");
  }).catch(() => {
    showToast("Không thể sao chép tự động!");
  });
}

// Toast notification
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
