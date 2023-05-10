const shareLaunchSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    category: { enum: ["生鮮魚肉", "蔬菜", "水果", "零食", "飲品", "其他"] },
    food_description: { type: "string" },
    image: { type: "string" },
    expiry_date: { type: "string", format: "date" },
    county: { type: "string", minLength: 1 },
    district: { type: "string", minLength: 1 },
    address: { type: "string", minLength: 1 },
    meet_up_datetime: { type: "string", format: "date-time" },
    unit_description: { type: "string", minLength: 1 },
    total_portions: { type: "integer", minimum: 1 },
    own_portions: { type: "integer", minimum: 1 },
    price: { type: "integer", minimum: 1 },
    location: {
      type: "object",
      properties: {
        lat: { type: "number", minimum: -90.0, maximum: 90.0 },
        lng: { type: "number", minimum: -180.0, maximum: 180.0 },
      },
    },
  },
  required: [
    "name",
    "category",
    "expiry_date",
    "county",
    "district",
    "address",
    "meet_up_datetime",
    "unit_description",
    "total_portions",
    "own_portions",
    "price",
    "location",
  ],
  additionalProperties: false,
};

const shareSearchSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    category: { enum: ["生鮮魚肉", "蔬菜", "水果", "零食", "飲品", "其他"] },
    county: { type: "string", minLength: 1 },
    district: { type: "string", minLength: 1 },
  },
  required: ["name", "category", "county", "district"],
  additionalProperties: false,
};

const shareJoinSchema = {
  type: "object",
  properties: {
    share_id: { type: "integer", minimum: 0 },
    taken_portions: { type: "integer", minimum: 1 },
  },
  required: ["share_id", "taken_portions"],
  additionalProperties: false,
};

module.exports = {
  shareLaunchSchema,
  shareSearchSchema,
  shareJoinSchema,
};
