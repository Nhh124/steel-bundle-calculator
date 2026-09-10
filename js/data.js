/**
 * Dữ liệu quy cách bó thép và barem trọng lượng trích xuất từ bảng tra thực tế.
 * Chiều dài tiêu chuẩn cây thép: 11.7 mét.
 */

const STANDARD_BAREM = {
  D10: { kg_m: 0.617, kg_cay: 7.22 },
  D12: { kg_m: 0.888, kg_cay: 10.39 },
  D14: { kg_m: 1.210, kg_cay: 14.16 },
  D16: { kg_m: 1.580, kg_cay: 18.49 },
  D18: { kg_m: 2.000, kg_cay: 23.40 },
  D20: { kg_m: 2.470, kg_cay: 28.90 },
  D22: { kg_m: 2.980, kg_cay: 34.87 },
  D25: { kg_m: 3.850, kg_cay: 45.05 },
  D28: { kg_m: 4.830, kg_cay: 56.51 },
  D32: { kg_m: 6.310, kg_cay: 73.83 },
  D36: { kg_m: 7.990, kg_cay: 93.48 }
};

const STEEL_SUPPLIERS = {
  hoa_phat: {
    id: "hoa_phat",
    name: "HÒA PHÁT",
    code: "HP",
    location: "Bình Dương, Ninh Thuận (BD, NT)",
    badgeColor: "#0284c7",
    specs: {
      D10: { bundle: 440, cb4_5: 6.89, cb3: 6.22 },
      D12: { bundle: 320, cb4_5: 9.92, cb3: 9.92 },
      D14: { bundle: 222, cb4_5: 13.59, cb3: 13.59 },
      D16: { bundle: 180, cb4_5: 17.84, cb3: 17.25 },
      D18: { bundle: 138, cb4_5: 22.48, cb3: 22.48 },
      D20: { bundle: 114, cb4_5: 27.77, cb3: 27.77 },
      D22: { bundle: 90,  cb4_5: 33.47, cb3: null },
      D25: { bundle: 72,  cb4_5: 43.69, cb3: null },
      D28: { bundle: 57,  cb4_5: 55.04, cb3: null },
      D32: { bundle: 45,  cb4_5: 71.84, cb3: null },
      D36: { bundle: 35,  cb4_5: 91.61, cb3: null }
    },
    coil: {
      D6: { kg_cuon: 2100 },
      D8: { kg_cuon: 2100 }
    }
  },

  vas: {
    id: "vas",
    name: "VAS (VIỆT MỸ)",
    code: "VAS",
    location: "Thương Mại, An Hưng Tường (TM, AHT)",
    badgeColor: "#dc2626",
    specs: {
      D10: { bundle: 440, cb4_5: 6.91, cb3: 6.22 },
      D12: { bundle: 320, cb4_5: 9.92, cb3: 9.87 },
      D14: { bundle: 222, cb4_5: 13.60, cb3: 13.56 },
      D16: { bundle: 180, cb4_5: 17.81, cb3: 17.21 },
      D18: { bundle: 138, cb4_5: 22.51, cb3: 22.41 },
      D20: { bundle: 114, cb4_5: 27.79, cb3: 27.71 },
      D22: { bundle: 90,  cb4_5: 33.51, cb3: null },
      D25: { bundle: 72,  cb4_5: 43.70, cb3: null },
      D28: { bundle: 57,  cb4_5: 54.96, cb3: null },
      D32: { bundle: 45,  cb4_5: 71.80, cb3: null },
      D36: { bundle: null, cb4_5: 91.61, cb3: null }
    },
    coil: {
      D6: { kg_cuon: 2100 },
      D8: { kg_cuon: 2100 }
    }
  },

  pomina: {
    id: "pomina",
    name: "POMINA",
    code: "PM",
    location: "Bình Dương, Phú Mỹ (BD, PM)",
    badgeColor: "#ea580c",
    specs: {
      D10: { bundle: 230, cb4_5: 6.93, cb3: 6.25 },
      D12: { bundle: 200, cb4_5: 9.98, cb3: 9.77 },
      D14: { bundle: 140, cb4_5: 13.60, cb3: 13.45 },
      D16: { bundle: 120, cb4_5: 17.76, cb3: 17.56 },
      D18: { bundle: 100, cb4_5: 22.47, cb3: 22.23 },
      D20: { bundle: 80,  cb4_5: 27.75, cb3: 27.45 },
      D22: { bundle: 60,  cb4_5: 33.54, cb3: null },
      D25: { bundle: 50,  cb4_5: 43.70, cb3: null },
      D28: { bundle: 40,  cb4_5: 54.81, cb3: null },
      D32: { bundle: 30,  cb4_5: 71.62, cb3: null },
      D36: { bundle: null, cb4_5: 91.52, cb3: null }
    },
    coil: {
      D6: { kg_cuon: 780 },
      D8: { kg_cuon: 780 }
    }
  },

  mien_nam: {
    id: "mien_nam",
    name: "MIỀN NAM",
    code: "MN",
    location: "Phú Mỹ, Thủ Đức, Biên Hòa, Nhà Bè (PM, TĐ, BH, NB)",
    badgeColor: "#16a34a",
    specs: {
      D10: { bundle: 350, cb4_5: 6.93, cb3: 6.22 },
      D12: { bundle: 250, cb4_5: 9.97, cb3: 9.89 },
      D14: { bundle: 180, cb4_5: 13.59, cb3: 13.56 },
      D16: { bundle: 140, cb4_5: 17.75, cb3: 17.56 },
      D18: { bundle: 110, cb4_5: 22.46, cb3: 22.41 },
      D20: { bundle: 90,  cb4_5: 27.74, cb3: 27.71 },
      D22: { bundle: 70,  cb4_5: 33.51, cb3: 33.51 },
      D25: { bundle: 58,  cb4_5: 43.63, cb3: 43.63 },
      D28: { bundle: 45,  cb4_5: 54.81, cb3: 54.81 },
      D32: { bundle: 35,  cb4_5: 71.61, cb3: null },
      D36: { bundle: 27,  cb4_5: 91.52, cb3: null }
    },
    coil: {
      D6: { kg_cuon: 2100 },
      D8: { kg_cuon: 2100 }
    }
  },

  tung_ho: {
    id: "tung_ho",
    name: "TUNG HO",
    code: "TH",
    location: "Phú Mỹ (PM)",
    badgeColor: "#9333ea",
    specs: {
      D10: { bundle: 300, cb4_5: 6.92, cb3: 6.92 },
      D12: { bundle: 260, cb4_5: 9.98, cb3: 9.98 },
      D14: { bundle: 190, cb4_5: 13.57, cb3: 13.57 },
      D16: { bundle: 150, cb4_5: 17.73, cb3: 17.73 },
      D18: { bundle: 115, cb4_5: 22.45, cb3: 22.45 },
      D20: { bundle: 95,  cb4_5: 27.71, cb3: 27.71 },
      D22: { bundle: 76,  cb4_5: 33.51, cb3: 33.51 },
      D25: { bundle: 60,  cb4_5: 43.63, cb3: 43.63 },
      D28: { bundle: 48,  cb4_5: 54.75, cb3: 54.75 },
      D32: { bundle: 36,  cb4_5: 71.60, cb3: 71.60 },
      D36: { bundle: null, cb4_5: null,  cb3: null }
    },
    coil: {
      D6: { kg_cuon: 1570 },
      D8: { kg_cuon: 1570 }
    }
  },

  vina_kyoei: {
    id: "vina_kyoei",
    name: "VINA KYOEI",
    code: "VK",
    location: "Phú Mỹ (PM)",
    badgeColor: "#2563eb",
    specs: {
      D10: { bundle: 300, cb4_5: 6.93, cb3: 6.93 },
      D12: { bundle: 260, cb4_5: 9.98, cb3: 9.98 },
      D14: { bundle: 190, cb4_5: 13.57, cb3: 13.57 },
      D16: { bundle: 150, cb4_5: 17.74, cb3: 17.74 },
      D18: { bundle: 115, cb4_5: 22.45, cb3: 22.45 },
      D20: { bundle: 95,  cb4_5: 27.71, cb3: 27.71 },
      D22: { bundle: 76,  cb4_5: 33.52, cb3: 33.52 },
      D25: { bundle: 60,  cb4_5: 43.64, cb3: 43.64 },
      D28: { bundle: 48,  cb4_5: 54.76, cb3: 54.76 },
      D32: { bundle: 36,  cb4_5: 71.60, cb3: 71.60 },
      D36: { bundle: null, cb4_5: null,  cb3: null }
    },
    coil: {
      D6: { kg_cuon: 780 },
      D8: { kg_cuon: 780 }
    }
  }
};

// Hỗ trợ xuất module nếu dùng trong môi trường Node.js / Testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = { STANDARD_BAREM, STEEL_SUPPLIERS };
}
