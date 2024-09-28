import Product from "./models/productModel.js";
const data = async () => {
  const products = [
    {
      productName: "iPhone 14 Pro",
      brandName: "Apple",
      category: "Phone",
      productImage: [
        "https://example.com/iphone14pro-front.jpg",
        "https://example.com/iphone14pro-back.jpg",
      ],
      description:
        "The latest iPhone with A15 Bionic chip, triple-camera system, and ProMotion display.",
      price: 1200,
      sellingPrice: 1150,
    },
    {
      productName: "Samsung Galaxy S23",
      brandName: "Samsung",
      category: "Phone",
      productImage: [
        "https://example.com/galaxyS23-front.jpg",
        "https://example.com/galaxyS23-back.jpg",
      ],
      description:
        "The flagship smartphone with an advanced camera system and 5G capability.",
      price: 1100,
      sellingPrice: 1050,
    },
    {
      productName: "MacBook Air M2",
      brandName: "Apple",
      category: "Laptops",
      productImage: [
        "https://example.com/macbook-air-front.jpg",
        "https://example.com/macbook-air-side.jpg",
      ],
      description:
        "The lightweight and powerful MacBook Air with M2 chip, Retina display, and all-day battery life.",
      price: 1500,
      sellingPrice: 1400,
    },
    {
      productName: "Sony WH-1000XM5",
      brandName: "Sony",
      category: "Earphones",
      productImage: ["https://example.com/sony-wh1000xm5.jpg"],
      description:
        "Noise-cancelling over-ear headphones with exceptional sound quality and long battery life.",
      price: 350,
      sellingPrice: 300,
    },
    {
      productName: "Dell XPS 13",
      brandName: "Dell",
      category: "Laptops",
      productImage: [
        "https://example.com/dell-xps13-front.jpg",
        "https://example.com/dell-xps13-side.jpg",
      ],
      description:
        "A powerful ultrabook with a stunning display and 11th Gen Intel Core processors.",
      price: 1300,
      sellingPrice: 1250,
    },
    {
      productName: "Samsung QLED 8K TV",
      brandName: "Samsung",
      category: "Laptops",
      productImage: [
        "https://example.com/qled8k-front.jpg",
        "https://example.com/qled8k-side.jpg",
      ],
      description:
        "Ultra high-definition 8K TV with Quantum Dot technology and HDR10+.",
      price: 5000,
      sellingPrice: 4700,
    },
    {
      productName: "Bose SoundLink Revolve+",
      brandName: "Bose",
      category: "Earphones",
      productImage: ["https://example.com/bose-soundlink.jpg"],
      description:
        "Portable Bluetooth speaker with 360-degree sound and water-resistant design.",
      price: 300,
      sellingPrice: 280,
    },
    {
      productName: "Canon EOS R6",
      brandName: "Canon",
      category: "Earphones",
      productImage: ["https://example.com/canon-eos-r6.jpg"],
      description:
        "Full-frame mirrorless camera with 4K video recording and fast autofocus system.",
      price: 2500,
      sellingPrice: 2400,
    },
  ];
  await Product.insertMany(products);
  console.log("Products seeded.");
};
export default data;
