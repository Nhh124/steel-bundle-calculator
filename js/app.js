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
  
  // Khởi tạo tính năng Tab Chính và 2 Tab Barem Quốc Tế
  initMainTabs();
  initQteBundleCalculator(); // Tab 2: Tính bó barem quốc tế (nằm ở giữa)
  initQteCalculator();       // Tab 3: Quy đổi barem quốc tế (cây/cuộn)
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

  let resultText = "";
  if (totalBars === 0) {
    resultText = "0 bó + 0";
  } else if (oddBars === 0) {
    resultText = `${fullBundles} bó`;
  } else {
    resultText = `${fullBundles} bó + ${oddBars}`;
  }

  navigator.clipboard.writeText(resultText).then(() => {
    showToast(`Đã sao chép: "${resultText}"`);
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

/* ==========================================================================
   MODULE 2: TÍNH BÓ BAREM QUỐC TẾ (NẰM Ở GIỮA 2 TAB CŨ)
   Quy đổi giữa Khối lượng (Kg/Tấn) <-> Bó chẵn + Cây lẻ theo Barem Quốc Tế (klm_qte)
   Ví dụ D14: 1 cây (11.7m) = 14.1570 kg (1.21 kg/m x 11.7m)
   ========================================================================== */

let qteBSupplierId = "mien_nam"; // Mặc định Thép Miền Nam
let qteBDiameter = "D14";       // Mặc định D14 (như hình minh họa ERP của user)
let qteBMode = "weight_to_bundle"; // 'weight_to_bundle', 'bars_to_bundle', 'bundle_to_bars'
let qteBWeightUnit = "kg";     // 'kg' hoặc 'ton'
let qteBVehicleItems = [];

function initQteBundleCalculator() {
  renderQteBSuppliers();
  renderQteBDiameters();
  setupQteBEventListeners();
  calculateQteB();
}

function renderQteBSuppliers() {
  const container = document.getElementById("qte-b-supplier-radios");
  if (!container) return;
  container.innerHTML = "";
  
  Object.values(STEEL_SUPPLIERS).forEach((supplier) => {
    const isChecked = supplier.id === qteBSupplierId;
    const item = document.createElement("label");
    item.className = "supplier-radio-item";
    item.innerHTML = `
      <input type="radio" name="qte-b-supplier" value="${supplier.id}" ${isChecked ? "checked" : ""}>
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
    container.appendChild(item);
  });
}

function renderQteBDiameters() {
  const container = document.getElementById("qte-b-diameter-btns");
  if (!container) return;
  const diameters = ["D10", "D12", "D14", "D16", "D18", "D20", "D22", "D25", "D28", "D32", "D36", "D40"];
  container.innerHTML = "";
  
  const currentSupplier = STEEL_SUPPLIERS[qteBSupplierId];
  
  diameters.forEach((d) => {
    const spec = currentSupplier.specs[d];
    const isAvailable = spec && spec.bundle !== null;
    const isActive = d === qteBDiameter;
    
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `diameter-btn ${isActive ? "active" : ""}`;
    btn.disabled = !isAvailable;
    btn.textContent = d;
    if (!isAvailable) {
      btn.title = "Nhà cung cấp không đóng bó cho kích cỡ này";
    }
    
    btn.addEventListener("click", () => {
      qteBDiameter = d;
      renderQteBDiameters();
      calculateQteB();
    });
    
    container.appendChild(btn);
  });
}

function setupQteBEventListeners() {
  const supplierContainer = document.getElementById("qte-b-supplier-radios");
  if (supplierContainer) {
    supplierContainer.addEventListener("change", (e) => {
      if (e.target.name === "qte-b-supplier") {
        qteBSupplierId = e.target.value;
        const supplier = STEEL_SUPPLIERS[qteBSupplierId];
        if (!supplier.specs[qteBDiameter] || supplier.specs[qteBDiameter].bundle === null) {
          for (const [d, spec] of Object.entries(supplier.specs)) {
            if (spec.bundle !== null) {
              qteBDiameter = d;
              break;
            }
          }
        }
        renderQteBDiameters();
        calculateQteB();
      }
    });
  }

  const tabWToBundle = document.getElementById("qte-b-tab-w-to-bundle");
  const tabBarsToBundle = document.getElementById("qte-b-tab-bars-to-bundle");
  const tabBundleToBars = document.getElementById("qte-b-tab-bundle-to-bars");
  const secWToBundle = document.getElementById("qte-b-sec-weight-to-bundle");
  const secBarsToBundle = document.getElementById("qte-b-sec-bars-to-bundle");
  const secBundleToBars = document.getElementById("qte-b-sec-bundle-to-bars");

  function switchMode(newMode) {
    qteBMode = newMode;
    [tabWToBundle, tabBarsToBundle, tabBundleToBars].forEach(t => t.classList.remove("active"));
    [secWToBundle, secBarsToBundle, secBundleToBars].forEach(s => s.style.display = "none");

    if (newMode === "weight_to_bundle") {
      tabWToBundle.classList.add("active");
      secWToBundle.style.display = "block";
    } else if (newMode === "bars_to_bundle") {
      tabBarsToBundle.classList.add("active");
      secBarsToBundle.style.display = "block";
    } else {
      tabBundleToBars.classList.add("active");
      secBundleToBars.style.display = "block";
    }
    calculateQteB();
  }

  tabWToBundle.addEventListener("click", () => switchMode("weight_to_bundle"));
  tabBarsToBundle.addEventListener("click", () => switchMode("bars_to_bundle"));
  tabBundleToBars.addEventListener("click", () => switchMode("bundle_to_bars"));

  const unitKgBtn = document.getElementById("qte-b-unit-kg");
  const unitTonBtn = document.getElementById("qte-b-unit-ton");
  const inputWeight = document.getElementById("qte-b-input-weight");

  unitKgBtn.addEventListener("click", () => {
    if (qteBWeightUnit === "ton") {
      qteBWeightUnit = "kg";
      unitKgBtn.classList.add("active");
      unitTonBtn.classList.remove("active");
      const currentVal = parseFloat(inputWeight.value) || 0;
      inputWeight.value = Math.round(currentVal * 1000);
      calculateQteB();
    }
  });

  unitTonBtn.addEventListener("click", () => {
    if (qteBWeightUnit === "kg") {
      qteBWeightUnit = "ton";
      unitTonBtn.classList.add("active");
      unitKgBtn.classList.remove("active");
      const currentVal = parseFloat(inputWeight.value) || 0;
      inputWeight.value = (currentVal / 1000).toFixed(3);
      calculateQteB();
    }
  });

  inputWeight.addEventListener("input", calculateQteB);
  document.getElementById("qte-b-input-bars").addEventListener("input", calculateQteB);
  document.getElementById("qte-b-input-bundles").addEventListener("input", calculateQteB);
  document.getElementById("qte-b-input-odd-bars").addEventListener("input", calculateQteB);

  document.querySelectorAll(".qte-b-quick-w").forEach(btn => {
    btn.addEventListener("click", () => {
      const addValKg = parseFloat(btn.dataset.val);
      const currentVal = parseFloat(inputWeight.value) || 0;
      if (qteBWeightUnit === "ton") {
        inputWeight.value = (currentVal + (addValKg / 1000)).toFixed(3);
      } else {
        inputWeight.value = Math.round(currentVal + addValKg);
      }
      calculateQteB();
    });
  });

  document.querySelectorAll(".qte-b-quick-bars").forEach(btn => {
    btn.addEventListener("click", () => {
      const addVal = parseInt(btn.dataset.val, 10);
      const inputBars = document.getElementById("qte-b-input-bars");
      const current = parseInt(inputBars.value, 10) || 0;
      inputBars.value = current + addVal;
      calculateQteB();
    });
  });

  document.getElementById("qte-b-btn-copy-result").addEventListener("click", copyQteBResult);
  document.getElementById("qte-b-btn-add-to-vehicle").addEventListener("click", addQteBToVehicleTrip);
  document.getElementById("qte-b-btn-copy-vehicle").addEventListener("click", copyQteBVehicleList);
  document.getElementById("qte-b-btn-clear-vehicle").addEventListener("click", () => {
    if (confirm("Bạn có chắc chắn muốn xóa danh sách chuyến xe Barem QT?")) {
      qteBVehicleItems = [];
      renderQteBVehicleTable();
      showToast("Đã xóa danh sách chuyến xe Barem QT!");
    }
  });
}

function calculateQteB() {
  const supplier = STEEL_SUPPLIERS[qteBSupplierId];
  const spec = supplier.specs[qteBDiameter];
  const qteSpec = QTE_BAREM.DB[qteBDiameter];

  const specBanner = document.getElementById("qte-b-spec-banner");
  const resHighlight = document.getElementById("qte-b-result-highlight");
  const resFullBundlesVal = document.getElementById("qte-b-res-full-bundles-val");
  const resOddBarsVal = document.getElementById("qte-b-res-odd-bars-val");
  const resOddBarsSub = document.getElementById("qte-b-res-odd-bars-sub");
  const resTotalBarsVal = document.getElementById("qte-b-res-total-bars-val");
  const resTotalBarsSub = document.getElementById("qte-b-res-total-bars-sub");
  const resEstWeightVal = document.getElementById("qte-b-res-est-weight-val");

  if (!spec || spec.bundle === null || !qteSpec) {
    specBanner.innerHTML = `Chủng loại <strong>${qteBDiameter}</strong> không có thông số đóng bó của <strong>${supplier.name}</strong>.`;
    resHighlight.innerHTML = `<span style="color:#f87171">Không có quy cách</span>`;
    resFullBundlesVal.textContent = "0";
    resOddBarsVal.textContent = "0";
    resTotalBarsVal.textContent = "0";
    resEstWeightVal.textContent = "0 kg";
    return;
  }

  const bundleSize = spec.bundle;
  const klmQte = qteSpec.klm_qte; // kg/m
  const weightPerBar = klmQte * 11.7; // Tỷ lệ chuyển đổi: kg/cây (11.7m)
  const fullBundleWeight = bundleSize * weightPerBar;

  specBanner.innerHTML = `Quy cách <strong>${supplier.name}</strong> - <strong>${qteBDiameter}</strong>: <strong>${bundleSize} cây/bó</strong> | Barem QT: <strong>${klmQte.toFixed(3)} kg/m</strong> ➔ Tỷ lệ: <strong>${weightPerBar.toFixed(4)} kg/cây</strong> | 1 Bó nguyên = <strong>${fullBundleWeight.toFixed(2)} kg</strong>`;

  let totalBars = 0;
  let fullBundles = 0;
  let oddBars = 0;
  let calculatedWeightKg = 0;
  let weightDiffKg = 0;

  if (qteBMode === "weight_to_bundle") {
    const inputWeight = document.getElementById("qte-b-input-weight");
    let rawWeight = parseFloat(inputWeight.value) || 0;
    let inputKg = qteBWeightUnit === "ton" ? rawWeight * 1000 : rawWeight;
    inputKg = Math.max(0, inputKg);

    const exactBars = inputKg / weightPerBar;
    totalBars = Math.round(exactBars);
    fullBundles = Math.floor(totalBars / bundleSize);
    oddBars = totalBars % bundleSize;
    calculatedWeightKg = totalBars * weightPerBar;
    weightDiffKg = inputKg - calculatedWeightKg;

    resTotalBarsSub.textContent = `Chính xác theo Kg: ${exactBars.toFixed(2)} cây`;
    if (Math.abs(weightDiffKg) > 0.05) {
      resOddBarsSub.textContent = `Lệch do làm tròn: ${weightDiffKg > 0 ? "+" : ""}${weightDiffKg.toFixed(2)} kg`;
    } else {
      resOddBarsSub.textContent = `Tròn cây chuẩn xác`;
    }
  } else if (qteBMode === "bars_to_bundle") {
    const inputBars = document.getElementById("qte-b-input-bars");
    totalBars = Math.max(0, parseInt(inputBars.value, 10) || 0);
    fullBundles = Math.floor(totalBars / bundleSize);
    oddBars = totalBars % bundleSize;
    calculatedWeightKg = totalBars * weightPerBar;
    resTotalBarsSub.textContent = `Toàn bộ lô thép`;
    resOddBarsSub.textContent = `Cây lẻ ngoài bó`;
  } else {
    // bundle_to_bars
    const inputBundles = document.getElementById("qte-b-input-bundles");
    const inputOddBars = document.getElementById("qte-b-input-odd-bars");
    fullBundles = Math.max(0, parseInt(inputBundles.value, 10) || 0);
    oddBars = Math.max(0, parseInt(inputOddBars.value, 10) || 0);
    totalBars = (fullBundles * bundleSize) + oddBars;
    calculatedWeightKg = totalBars * weightPerBar;
    resTotalBarsSub.textContent = `Toàn bộ lô thép`;
    resOddBarsSub.textContent = `Cây lẻ ngoài bó`;
  }

  if (totalBars === 0) {
    resHighlight.innerHTML = `0 <span>bó</span> + 0`;
  } else if (oddBars === 0) {
    resHighlight.innerHTML = `${fullBundles.toLocaleString()} <span>bó</span>`;
  } else {
    resHighlight.innerHTML = `${fullBundles.toLocaleString()} <span>bó</span> + ${oddBars.toLocaleString()}`;
  }

  resFullBundlesVal.textContent = `${fullBundles.toLocaleString()} bó (= ${(fullBundles * bundleSize).toLocaleString()} cây)`;
  resOddBarsVal.textContent = `${oddBars.toLocaleString()} cây`;
  resTotalBarsVal.textContent = `${totalBars.toLocaleString()} cây`;
  resEstWeightVal.textContent = `${Math.round(calculatedWeightKg).toLocaleString()} kg (${(calculatedWeightKg / 1000).toFixed(3)} tấn)`;
}

function copyQteBResult() {
  const supplier = STEEL_SUPPLIERS[qteBSupplierId];
  const spec = supplier.specs[qteBDiameter];
  const qteSpec = QTE_BAREM.DB[qteBDiameter];
  if (!spec || spec.bundle === null || !qteSpec) return;

  const bundleSize = spec.bundle;
  const weightPerBar = qteSpec.klm_qte * 11.7;

  let totalBars = 0;
  let fullBundles = 0;
  let oddBars = 0;

  if (qteBMode === "weight_to_bundle") {
    const inputWeight = document.getElementById("qte-b-input-weight");
    let rawWeight = parseFloat(inputWeight.value) || 0;
    let inputKg = qteBWeightUnit === "ton" ? rawWeight * 1000 : rawWeight;
    totalBars = Math.round(inputKg / weightPerBar);
    fullBundles = Math.floor(totalBars / bundleSize);
    oddBars = totalBars % bundleSize;
  } else if (qteBMode === "bars_to_bundle") {
    const inputBars = document.getElementById("qte-b-input-bars");
    totalBars = Math.max(0, parseInt(inputBars.value, 10) || 0);
    fullBundles = Math.floor(totalBars / bundleSize);
    oddBars = totalBars % bundleSize;
  } else {
    const inputBundles = document.getElementById("qte-b-input-bundles");
    const inputOddBars = document.getElementById("qte-b-input-odd-bars");
    fullBundles = Math.max(0, parseInt(inputBundles.value, 10) || 0);
    oddBars = Math.max(0, parseInt(inputOddBars.value, 10) || 0);
    totalBars = (fullBundles * bundleSize) + oddBars;
  }

  let resultShort = oddBars === 0 ? `${fullBundles} bó` : `${fullBundles} bó + ${oddBars}`;
  const totalWeightKg = Math.round(totalBars * weightPerBar);

  let text = `KẾT QUẢ TÍNH BÓ BAREM QUỐC TẾ (BRQT):\n`;
  text += `- Mặt hàng: ${supplier.name} ${qteBDiameter} (11.7m)\n`;
  text += `- Quy cách: ${bundleSize} cây/bó | Tỷ lệ Barem QT: ${weightPerBar.toFixed(4)} kg/cây\n`;
  text += `- Tổng số cây: ${totalBars.toLocaleString()} cây\n`;
  text += `➔ QUY ĐỔI: ${resultShort}\n`;
  text += `- Tổng KL Barem QT: ${totalWeightKg.toLocaleString()} kg (~${(totalWeightKg/1000).toFixed(3)} tấn)`;

  navigator.clipboard.writeText(text).then(() => {
    showToast(`Đã sao chép: "${resultShort}" (Barem QT)`);
  }).catch(() => {
    showToast("Không thể sao chép tự động!");
  });
}

function addQteBToVehicleTrip() {
  const supplier = STEEL_SUPPLIERS[qteBSupplierId];
  const spec = supplier.specs[qteBDiameter];
  const qteSpec = QTE_BAREM.DB[qteBDiameter];
  if (!spec || spec.bundle === null || !qteSpec) return;

  const bundleSize = spec.bundle;
  const weightPerBar = qteSpec.klm_qte * 11.7;

  let totalBars = 0;
  let fullBundles = 0;
  let oddBars = 0;

  if (qteBMode === "weight_to_bundle") {
    const inputWeight = document.getElementById("qte-b-input-weight");
    let rawWeight = parseFloat(inputWeight.value) || 0;
    let inputKg = qteBWeightUnit === "ton" ? rawWeight * 1000 : rawWeight;
    totalBars = Math.round(inputKg / weightPerBar);
    fullBundles = Math.floor(totalBars / bundleSize);
    oddBars = totalBars % bundleSize;
  } else if (qteBMode === "bars_to_bundle") {
    const inputBars = document.getElementById("qte-b-input-bars");
    totalBars = Math.max(0, parseInt(inputBars.value, 10) || 0);
    fullBundles = Math.floor(totalBars / bundleSize);
    oddBars = totalBars % bundleSize;
  } else {
    const inputBundles = document.getElementById("qte-b-input-bundles");
    const inputOddBars = document.getElementById("qte-b-input-odd-bars");
    fullBundles = Math.max(0, parseInt(inputBundles.value, 10) || 0);
    oddBars = Math.max(0, parseInt(inputOddBars.value, 10) || 0);
    totalBars = (fullBundles * bundleSize) + oddBars;
  }

  if (totalBars <= 0) {
    showToast("Vui lòng nhập số cây hoặc khối lượng lớn hơn 0!");
    return;
  }

  const weightKg = Math.round(totalBars * weightPerBar);

  qteBVehicleItems.push({
    id: Date.now(),
    supplierName: supplier.name,
    supplierCode: supplier.code,
    diameter: qteBDiameter,
    bundleSize: bundleSize,
    totalBars: totalBars,
    bundles: fullBundles,
    oddBars: oddBars,
    weightKg: weightKg,
    rate: weightPerBar.toFixed(4)
  });

  renderQteBVehicleTable();
  showToast(`Đã thêm ${qteBDiameter} (${totalBars} cây) vào chuyến xe Barem QT!`);
}

function renderQteBVehicleTable() {
  const tableBody = document.getElementById("qte-b-vehicle-table-body");
  const totalCountEl = document.getElementById("qte-b-vehicle-total-count");
  const footRow = document.getElementById("qte-b-vehicle-foot-row");

  tableBody.innerHTML = "";
  totalCountEl.textContent = qteBVehicleItems.length;

  if (qteBVehicleItems.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#94a3b8; padding:20px;">Chưa có mặt hàng nào. Nhập số liệu ở trên và bấm "Thêm Vào Danh Sách Phiếu Cân Xe".</td></tr>`;
    footRow.style.display = "none";
    return;
  }

  footRow.style.display = "table-row";

  let sumBars = 0;
  let sumBundles = 0;
  let sumOdd = 0;
  let sumWeight = 0;

  qteBVehicleItems.forEach((item, index) => {
    sumBars += item.totalBars;
    sumBundles += item.bundles;
    sumOdd += item.oddBars;
    sumWeight += item.weightKg;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td><strong>${item.supplierCode}</strong> - ${item.diameter} <span style="font-size:0.75rem; color:#64748b;">(QT: ${item.rate} kg/c)</span></td>
      <td><strong>${item.totalBars.toLocaleString()}</strong></td>
      <td><span style="color:#0284c7; font-weight:bold;">${item.bundles}</span> bó (${item.bundleSize} c/b)</td>
      <td><span style="color:#ea580c; font-weight:bold;">${item.oddBars}</span> cây</td>
      <td>${item.weightKg.toLocaleString()} kg</td>
      <td><button type="button" class="btn-del" onclick="deleteQteBVehicleItem(${item.id})">Xóa</button></td>
    `;
    tableBody.appendChild(tr);
  });

  document.getElementById("qte-b-foot-total-bars").textContent = sumBars.toLocaleString();
  document.getElementById("qte-b-foot-total-bundles").textContent = `${sumBundles.toLocaleString()} bó`;
  document.getElementById("qte-b-foot-total-odd").textContent = `${sumOdd.toLocaleString()} cây`;
  document.getElementById("qte-b-foot-total-weight").textContent = `${sumWeight.toLocaleString()} kg (${(sumWeight/1000).toFixed(3)} tấn)`;
}

window.deleteQteBVehicleItem = function(id) {
  qteBVehicleItems = qteBVehicleItems.filter(item => item.id !== id);
  renderQteBVehicleTable();
  showToast("Đã xóa mặt hàng khỏi danh sách!");
};

function copyQteBVehicleList() {
  if (qteBVehicleItems.length === 0) {
    showToast("Danh sách chuyến xe đang trống!");
    return;
  }

  let text = `DANH SÁCH THÉP CHUYẾN XE (BAREM QUỐC TẾ - ${new Date().toLocaleDateString("vi-VN")}):\n`;
  let sumBars = 0;
  let sumBundles = 0;
  let sumOdd = 0;
  let sumWeight = 0;

  qteBVehicleItems.forEach((item, i) => {
    sumBars += item.totalBars;
    sumBundles += item.bundles;
    sumOdd += item.oddBars;
    sumWeight += item.weightKg;
    text += `${i + 1}. ${item.supplierName} ${item.diameter} (${item.rate} kg/c): ${item.totalBars.toLocaleString()} cây = ${item.bundles} bó + ${item.oddBars} (~${item.weightKg.toLocaleString()} kg)\n`;
  });

  text += `--------------------------\n`;
  text += `TỔNG CỘNG: ${sumBars.toLocaleString()} cây | ${sumBundles} bó + ${sumOdd}\n`;
  text += `TỔNG BAREM QT: ${sumWeight.toLocaleString()} kg (~${(sumWeight/1000).toFixed(3)} tấn)`;

  navigator.clipboard.writeText(text).then(() => {
    showToast("Đã sao chép danh sách chuyến xe (Barem QT)!");
  }).catch(() => {
    showToast("Không thể sao chép tự động!");
  });
}

/* ==========================================================================
   MODULE 3: QUY ĐỔI BAREM QUỐC TẾ (klm_qte)
   Hỗ trợ quy đổi 2 chiều Khối lượng <-> Số cây (DB) / Số cuộn (WR)
   ========================================================================== */

// State cho Tab Barem Quốc Tế
let qteCategory = "DB"; // 'DB' (Thép Cây) hoặc 'WR' (Thép Cuộn)
let qteDiameter = "D10";
let qteMode = "weight_to_qty"; // 'weight_to_qty' hoặc 'qty_to_weight'
let qteWeightUnit = "kg"; // 'kg' hoặc 'ton'
let qteBarLength = 11.7; // mét (cho thép cây)
let qteCoilWeight = 2000; // kg/cuộn (cho thép cuộn)

// Khởi tạo chuyển đổi Tab chính (Barem Nhà Máy vs Barem Quốc Tế)
function initMainTabs() {
  const mainTabBtns = document.querySelectorAll(".main-nav-btn");
  const tabContents = document.querySelectorAll(".main-tab-content");

  mainTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      mainTabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(tc => tc.classList.remove("active"));

      btn.classList.add("active");
      const targetId = btn.dataset.target;
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
}

// Khởi tạo chức năng Barem Quốc Tế
function initQteCalculator() {
  const catPillDb = document.getElementById("cat-pill-db");
  const catPillWr = document.getElementById("cat-pill-wr");
  const btnModeWToQty = document.getElementById("qte-mode-w-to-qty");
  const btnModeQtyToW = document.getElementById("qte-mode-qty-to-w");
  const sectionWToQty = document.getElementById("qte-section-weight-to-qty");
  const sectionQtyToW = document.getElementById("qte-section-qty-to-weight");

  const inputWeight = document.getElementById("qte-input-weight");
  const inputQty = document.getElementById("qte-input-qty");
  const btnCopyQte = document.getElementById("btn-copy-qte-result");

  // Đổi Nhóm Hàng (Thép Cây DB vs Thép Cuộn WR)
  catPillDb.addEventListener("click", () => {
    catPillDb.classList.add("active");
    catPillWr.classList.remove("active");
    qteCategory = "DB";
    qteDiameter = "D10";
    document.getElementById("qte-diameter-label").textContent = "Chọn Đường Kính Thép Cây (DB):";
    document.getElementById("qte-input-qty-label").textContent = "Nhập Số Cây Thép:";
    document.getElementById("qte-mode-w-to-qty").innerHTML = "⚖️ Nhập Khối Lượng ➔ Ra Số Cây";
    document.getElementById("qte-mode-qty-to-w").innerHTML = "🔢 Nhập Số Cây ➔ Ra Khối Lượng";
    renderQteDiameters();
    renderQteParamBox();
    calculateQte();
  });

  catPillWr.addEventListener("click", () => {
    catPillWr.classList.add("active");
    catPillDb.classList.remove("active");
    qteCategory = "WR";
    qteDiameter = "D6";
    document.getElementById("qte-diameter-label").textContent = "Chọn Đường Kính Thép Cuộn (WR):";
    document.getElementById("qte-input-qty-label").textContent = "Nhập Số Cuộn Thép:";
    document.getElementById("qte-mode-w-to-qty").innerHTML = "⚖️ Nhập Khối Lượng ➔ Ra Số Cuộn";
    document.getElementById("qte-mode-qty-to-w").innerHTML = "🌀 Nhập Số Cuộn ➔ Ra Khối Lượng";
    renderQteDiameters();
    renderQteParamBox();
    calculateQte();
  });

  // Đổi chiều tính toán (Khối lượng -> Số lượng hoặc ngược lại)
  btnModeWToQty.addEventListener("click", () => {
    btnModeWToQty.classList.add("active");
    btnModeQtyToW.classList.remove("active");
    qteMode = "weight_to_qty";
    sectionWToQty.style.display = "block";
    sectionQtyToW.style.display = "none";
    calculateQte();
  });

  btnModeQtyToW.addEventListener("click", () => {
    btnModeQtyToW.classList.add("active");
    btnModeWToQty.classList.remove("active");
    qteMode = "qty_to_weight";
    sectionWToQty.style.display = "none";
    sectionQtyToW.style.display = "block";
    calculateQte();
  });

  // Chuyển đơn vị Khối lượng (Kg <-> Tấn)
  document.querySelectorAll(".unit-switch-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".unit-switch-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const newUnit = btn.dataset.unit;
      const currentVal = parseFloat(inputWeight.value) || 0;
      
      if (qteWeightUnit === "kg" && newUnit === "ton") {
        inputWeight.value = (currentVal / 1000).toFixed(3);
      } else if (qteWeightUnit === "ton" && newUnit === "kg") {
        inputWeight.value = Math.round(currentVal * 1000);
      }
      qteWeightUnit = newUnit;
      calculateQte();
    });
  });

  // Lắng nghe thay đổi ô nhập số
  inputWeight.addEventListener("input", calculateQte);
  inputQty.addEventListener("input", calculateQte);

  // Nút cộng nhanh khối lượng
  document.querySelectorAll(".qte-quick-w-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const addValKg = parseFloat(btn.dataset.val);
      const currentVal = parseFloat(inputWeight.value) || 0;
      if (qteWeightUnit === "ton") {
        inputWeight.value = (currentVal + (addValKg / 1000)).toFixed(3);
      } else {
        inputWeight.value = Math.round(currentVal + addValKg);
      }
      calculateQte();
    });
  });

  // Nút cộng nhanh số cây / số cuộn
  document.querySelectorAll(".qte-quick-qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const addQty = parseInt(btn.dataset.val, 10);
      const currentQty = parseInt(inputQty.value, 10) || 0;
      inputQty.value = currentQty + addQty;
      calculateQte();
    });
  });

  // Sao chép kết quả
  btnCopyQte.addEventListener("click", copyQteResult);

  // Khởi tạo ban đầu
  renderQteDiameters();
  renderQteParamBox();
  calculateQte();
}

// Render nút chọn đường kính cho Barem Quốc Tế
function renderQteDiameters() {
  const container = document.getElementById("qte-diameter-btns");
  container.innerHTML = "";

  const specs = QTE_BAREM[qteCategory];
  Object.keys(specs).forEach(dKey => {
    const item = specs[dKey];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `diameter-btn ${dKey === qteDiameter ? "active" : ""}`;
    btn.textContent = item.name;

    btn.addEventListener("click", () => {
      qteDiameter = dKey;
      renderQteDiameters();
      renderQteParamBox();
      calculateQte();
    });

    container.appendChild(btn);
  });
}

// Render ô điều chỉnh chiều dài cây (DB) hoặc khối lượng 1 cuộn (WR)
function renderQteParamBox() {
  const box = document.getElementById("qte-param-box");
  const spec = QTE_BAREM[qteCategory][qteDiameter];

  if (qteCategory === "DB") {
    box.innerHTML = `
      <span>📏 Chiều dài cây thép:</span>
      <input type="number" id="qte-bar-length" step="0.1" min="1" value="${qteBarLength}">
      <span>mét</span>
      <span style="color: #64748b; font-size: 0.8rem;">(Chuẩn xuất kho nhà máy: 11.7m; hàng ngắn: 6m, 12m)</span>
    `;
    const inputLen = document.getElementById("qte-bar-length");
    inputLen.addEventListener("input", (e) => {
      qteBarLength = parseFloat(e.target.value) || 11.7;
      calculateQte();
    });
  } else {
    box.innerHTML = `
      <span>⚖️ Trọng lượng 1 cuộn ước tính:</span>
      <input type="number" id="qte-coil-weight" step="50" min="100" value="${qteCoilWeight}">
      <span>kg/cuộn</span>
      <div style="display:flex; gap:6px; margin-left:auto;">
        <button type="button" class="quick-btn" onclick="setQteCoilWeight(780)">780 kg</button>
        <button type="button" class="quick-btn" onclick="setQteCoilWeight(1000)">1,000 kg</button>
        <button type="button" class="quick-btn" onclick="setQteCoilWeight(1500)">1,500 kg</button>
        <button type="button" class="quick-btn" onclick="setQteCoilWeight(2000)">2,000 kg</button>
        <button type="button" class="quick-btn" onclick="setQteCoilWeight(2100)">2,100 kg</button>
      </div>
    `;
    const inputCoil = document.getElementById("qte-coil-weight");
    inputCoil.addEventListener("input", (e) => {
      qteCoilWeight = parseFloat(e.target.value) || 2000;
      calculateQte();
    });
  }
}

// Đặt nhanh trọng lượng cuộn
window.setQteCoilWeight = function(kg) {
  qteCoilWeight = kg;
  const input = document.getElementById("qte-coil-weight");
  if (input) input.value = kg;
  calculateQte();
};

// Tính toán quy đổi theo Barem Quốc Tế (klm_qte)
function calculateQte() {
  const spec = QTE_BAREM[qteCategory][qteDiameter];
  if (!spec) return;

  const klmQte = spec.klm_qte; // kg/m
  const banner = document.getElementById("qte-spec-banner");
  const resHighlight = document.getElementById("qte-result-highlight");
  const resQtyVal = document.getElementById("qte-res-qty-val");
  const resQtySub = document.getElementById("qte-res-qty-sub");
  const resQtyLabel = document.getElementById("qte-res-qty-label");
  const resWeightVal = document.getElementById("qte-res-weight-val");
  const resWeightSub = document.getElementById("qte-res-weight-sub");
  const resLengthVal = document.getElementById("qte-res-length-val");
  const resExtraVal = document.getElementById("qte-res-extra-val");
  const resExtraSub = document.getElementById("qte-res-extra-sub");
  const resExtraLabel = document.getElementById("qte-res-extra-label");

  const inputWeightEl = document.getElementById("qte-input-weight");
  const inputQtyEl = document.getElementById("qte-input-qty");

  // TRƯỜNG HỢP 1: THÉP CÂY / THANH VẰN (DB)
  if (qteCategory === "DB") {
    const barWeightKg = klmQte * qteBarLength; // Trọng lượng 1 cây chuẩn quốc tế
    banner.innerHTML = `Mặt hàng: <strong>${spec.name} (DB)</strong> | Chiều dài: <strong>${qteBarLength} m</strong> | Barem quốc tế (klm_qte): <strong>${klmQte.toFixed(3)} kg/m</strong> ➔ Trọng lượng 1 cây: <strong>${barWeightKg.toFixed(3)} kg/cây</strong>`;

    resQtyLabel.textContent = "Số Cây Thép Quy Đổi";
    resExtraLabel.textContent = "Khối Lượng Dư Sau Quy Đổi";

    if (qteMode === "weight_to_qty") {
      let rawWeight = parseFloat(inputWeightEl.value) || 0;
      let totalKg = qteWeightUnit === "ton" ? rawWeight * 1000 : rawWeight;
      totalKg = Math.max(0, totalKg);

      const exactBars = totalKg / barWeightKg;
      const fullBars = Math.floor(exactBars);
      const remainKg = totalKg - (fullBars * barWeightKg);
      const totalMeters = totalKg / klmQte;

      if (totalKg === 0) {
        resHighlight.innerHTML = `0 <span>cây</span>`;
      } else if (remainKg < 0.05) {
        resHighlight.innerHTML = `${fullBars.toLocaleString()} <span>cây (tròn)</span>`;
      } else {
        resHighlight.innerHTML = `${fullBars.toLocaleString()} <span>cây</span> <span style="font-size:1.1rem; color:#f59e0b;">(+ ${remainKg.toFixed(1)} kg)</span>`;
      }

      resQtyVal.textContent = `${fullBars.toLocaleString()} cây`;
      resQtySub.textContent = `Chính xác: ${exactBars.toFixed(2)} cây`;

      resWeightVal.textContent = `${Math.round(totalKg).toLocaleString()} kg`;
      resWeightSub.textContent = `${(totalKg / 1000).toFixed(3)} tấn`;

      resLengthVal.textContent = `${Math.round(totalMeters).toLocaleString()} m`;

      resExtraVal.textContent = `${remainKg.toFixed(1)} kg`;
      resExtraSub.textContent = `Tương đương ${(remainKg / barWeightKg).toFixed(2)} cây`;
    } else {
      // qty_to_weight
      let bars = Math.max(0, parseInt(inputQtyEl.value, 10) || 0);
      let totalKg = bars * barWeightKg;
      let totalMeters = bars * qteBarLength;

      resHighlight.innerHTML = `${Math.round(totalKg).toLocaleString()} <span>kg</span> <span style="font-size:1.1rem; color:#94a3b8;">(${(totalKg/1000).toFixed(3)} tấn)</span>`;

      resQtyVal.textContent = `${bars.toLocaleString()} cây`;
      resQtySub.textContent = `Đóng ${bars.toLocaleString()} cây theo barem quốc tế`;

      resWeightVal.textContent = `${Math.round(totalKg).toLocaleString()} kg`;
      resWeightSub.textContent = `${(totalKg / 1000).toFixed(3)} tấn`;

      resLengthVal.textContent = `${Math.round(totalMeters).toLocaleString()} m`;

      resExtraVal.textContent = `0 kg`;
      resExtraSub.textContent = `Tính theo chẵn ${bars.toLocaleString()} cây`;
    }
  } 
  // TRƯỜNG HỢP 2: THÉP CUỘN (WR)
  else {
    banner.innerHTML = `Mặt hàng: <strong>${spec.name} (WR)</strong> | Barem quốc tế (klm_qte): <strong>${klmQte.toFixed(3)} kg/m</strong> | Khối lượng 1 cuộn: <strong>${qteCoilWeight.toLocaleString()} kg/cuộn</strong>`;

    resQtyLabel.textContent = "Số Cuộn Thép Quy Đổi";
    resExtraLabel.textContent = "Khối Lượng Lẻ Ngoài Cuộn";

    if (qteMode === "weight_to_qty") {
      let rawWeight = parseFloat(inputWeightEl.value) || 0;
      let totalKg = qteWeightUnit === "ton" ? rawWeight * 1000 : rawWeight;
      totalKg = Math.max(0, totalKg);

      const exactCoils = totalKg / qteCoilWeight;
      const fullCoils = Math.floor(exactCoils);
      const remainKg = totalKg - (fullCoils * qteCoilWeight);
      const totalMeters = totalKg / klmQte;

      if (totalKg === 0) {
        resHighlight.innerHTML = `0 <span>cuộn</span>`;
      } else if (remainKg < 1) {
        resHighlight.innerHTML = `${fullCoils.toLocaleString()} <span>cuộn (tròn)</span>`;
      } else {
        resHighlight.innerHTML = `${fullCoils.toLocaleString()} <span>cuộn</span> <span style="font-size:1.1rem; color:#f59e0b;">(+ ${Math.round(remainKg).toLocaleString()} kg)</span>`;
      }

      resQtyVal.textContent = `${fullCoils.toLocaleString()} cuộn`;
      resQtySub.textContent = `Chính xác: ${exactCoils.toFixed(2)} cuộn`;

      resWeightVal.textContent = `${Math.round(totalKg).toLocaleString()} kg`;
      resWeightSub.textContent = `${(totalKg / 1000).toFixed(3)} tấn`;

      resLengthVal.textContent = `${Math.round(totalMeters).toLocaleString()} m`;

      resExtraVal.textContent = `${Math.round(remainKg).toLocaleString()} kg`;
      resExtraSub.textContent = `Tương đương ${(remainKg / qteCoilWeight).toFixed(2)} cuộn`;
    } else {
      // qty_to_weight
      let coils = Math.max(0, parseInt(inputQtyEl.value, 10) || 0);
      let totalKg = coils * qteCoilWeight;
      let totalMeters = totalKg / klmQte;

      resHighlight.innerHTML = `${Math.round(totalKg).toLocaleString()} <span>kg</span> <span style="font-size:1.1rem; color:#94a3b8;">(${(totalKg/1000).toFixed(3)} tấn)</span>`;

      resQtyVal.textContent = `${coils.toLocaleString()} cuộn`;
      resQtySub.textContent = `Quy chuẩn ${coils.toLocaleString()} cuộn x ${qteCoilWeight} kg`;

      resWeightVal.textContent = `${Math.round(totalKg).toLocaleString()} kg`;
      resWeightSub.textContent = `${(totalKg / 1000).toFixed(3)} tấn`;

      resLengthVal.textContent = `${Math.round(totalMeters).toLocaleString()} m`;

      resExtraVal.textContent = `0 kg`;
      resExtraSub.textContent = `Tính theo chẵn ${coils.toLocaleString()} cuộn`;
    }
  }
}

// Sao chép kết quả quy đổi Quốc Tế để gửi Zalo
function copyQteResult() {
  const spec = QTE_BAREM[qteCategory][qteDiameter];
  if (!spec) return;

  const klmQte = spec.klm_qte;
  const inputWeightEl = document.getElementById("qte-input-weight");
  const inputQtyEl = document.getElementById("qte-input-qty");

  let text = `QUY ĐỔI BAREM QUỐC TẾ (klm_qte):\n`;
  text += `- Thời gian: ${new Date().toLocaleString("vi-VN")}\n`;

  if (qteCategory === "DB") {
    const barWeightKg = klmQte * qteBarLength;
    text += `- Chủng loại: Thép cây ${spec.name} (DB)\n`;
    text += `- Chiều dài chuẩn: ${qteBarLength} m\n`;
    text += `- klm_qte: ${klmQte.toFixed(3)} kg/m (Barem: ${barWeightKg.toFixed(3)} kg/cây)\n`;

    if (qteMode === "weight_to_qty") {
      let rawWeight = parseFloat(inputWeightEl.value) || 0;
      let totalKg = qteWeightUnit === "ton" ? rawWeight * 1000 : rawWeight;
      const exactBars = totalKg / barWeightKg;
      const fullBars = Math.floor(exactBars);
      const remainKg = totalKg - (fullBars * barWeightKg);
      const totalMeters = totalKg / klmQte;

      text += `- Khối lượng cân: ${Math.round(totalKg).toLocaleString()} kg (${(totalKg/1000).toFixed(3)} tấn)\n`;
      text += `➔ KẾT QUẢ: ${fullBars.toLocaleString()} cây (Dư ${remainKg.toFixed(1)} kg | Chính xác: ${exactBars.toFixed(2)} cây)\n`;
      text += `- Tổng chiều dài: ~${Math.round(totalMeters).toLocaleString()} mét`;
    } else {
      let bars = Math.max(0, parseInt(inputQtyEl.value, 10) || 0);
      let totalKg = bars * barWeightKg;
      let totalMeters = bars * qteBarLength;

      text += `- Số lượng: ${bars.toLocaleString()} cây\n`;
      text += `➔ KHỐI LƯỢNG QUỐC TẾ: ${Math.round(totalKg).toLocaleString()} kg (${(totalKg/1000).toFixed(3)} tấn)\n`;
      text += `- Tổng chiều dài: ~${Math.round(totalMeters).toLocaleString()} mét`;
    }
  } else {
    text += `- Chủng loại: Thép cuộn ${spec.name} (WR)\n`;
    text += `- klm_qte: ${klmQte.toFixed(3)} kg/m\n`;
    text += `- Trọng lượng 1 cuộn: ${qteCoilWeight.toLocaleString()} kg/cuộn\n`;

    if (qteMode === "weight_to_qty") {
      let rawWeight = parseFloat(inputWeightEl.value) || 0;
      let totalKg = qteWeightUnit === "ton" ? rawWeight * 1000 : rawWeight;
      const exactCoils = totalKg / qteCoilWeight;
      const fullCoils = Math.floor(exactCoils);
      const remainKg = totalKg - (fullCoils * qteCoilWeight);
      const totalMeters = totalKg / klmQte;

      text += `- Khối lượng cân: ${Math.round(totalKg).toLocaleString()} kg (${(totalKg/1000).toFixed(3)} tấn)\n`;
      text += `➔ KẾT QUẢ: ${fullCoils.toLocaleString()} cuộn + ${Math.round(remainKg)} kg (Chính xác: ${exactCoils.toFixed(2)} cuộn)\n`;
      text += `- Tổng chiều dài mét: ~${Math.round(totalMeters).toLocaleString()} mét`;
    } else {
      let coils = Math.max(0, parseInt(inputQtyEl.value, 10) || 0);
      let totalKg = coils * qteCoilWeight;
      let totalMeters = totalKg / klmQte;

      text += `- Số lượng: ${coils.toLocaleString()} cuộn\n`;
      text += `➔ KHỐI LƯỢNG: ${Math.round(totalKg).toLocaleString()} kg (${(totalKg/1000).toFixed(3)} tấn)\n`;
      text += `- Tổng chiều dài mét: ~${Math.round(totalMeters).toLocaleString()} mét`;
    }
  }

  navigator.clipboard.writeText(text).then(() => {
    showToast("Đã sao chép kết quả quy đổi Barem Quốc Tế!");
  }).catch(() => {
    showToast("Không thể sao chép tự động!");
  });
}

