const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  currencySymbol: { type: String,  },
  currencyCode: { type: String, },
  amount: { type: String,  },
});

const packageSchema = new mongoose.Schema(
  { 
    createDate: {type: String},
    updatedDate: {type: String},
    createdBy: {type: String},
    editedBy: {type: String},
    packageName: { type: String, },
    businessDic: { type: String, },
    billingSesion: { type: String, },
    bgColor: { type: String, },
    iconColor: { type: String, },
    packageStatus: { type: String, },
    webStatus: { type: String,  },
    features: { type: [String],  },
    prices: {
      BDT: { type: priceSchema,  },
      USD: { type: priceSchema,  },
    },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;