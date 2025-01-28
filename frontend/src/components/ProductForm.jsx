import React, { useState } from "react";

const ProductForm = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState([]);

  const handleNameChange = (e) => {
    let name = e.target.value;
    setProductName(name);
  };
  const handleDescriptionChange = (e) => {
    let description = e.target.value;
    setProductDescription(description);
  };
  const handlePriceChange = (e) => {
    let price = e.target.value;
    setProductPrice(price);
  };
  const handleImageChange = (e) => {
    let image = e.target.files;
    let filesArray=Array.from(image)
    setProductImage([...productImage,...filesArray]);
    console.log(image)
  };
  const handleSubmit=(e)=>{
    e.preventDefault()
    let data={
        productName,
        productDescription,
        productPrice,
        productImage
    }
    console.log(data)

    setProductName("")
    setProductDescription("")
    setProductPrice("")
    setProductImage([])
  }
  return (
    <div className="max-w-lg mt-24 mx-auto p-6 bg-blue-200 shadow-lg rounded-lg">
      <form action="" className="space-y-4" onSubmit={handleSubmit}>
        <label htmlFor="" className="block text-sm font-medium text-gray-800">
          Product Name
        </label>
        <input
          type="text"
          placeholder="Enter Product Name"
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          value={productName}
          onChange={handleNameChange}
        />
        <label
          htmlFor=""
          className="block text-sm font-medium text-gray-800 rounded"
        >
          Product Descrition
        </label>
        <input
          type="text"
          placeholder="Enter Product Description"
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          value={productDescription}
          onChange={handleDescriptionChange}
        />
        <label htmlFor="" className="block text-sm font-medium text-gray-800">
          Product Price
        </label>
        <input
          type="text"
          placeholder="Enter Product Price"
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          value={productPrice}
          onChange={handlePriceChange}
        />
        <label htmlFor="" className="block text-sm font-medium text-gray-800">
          Product Images
        </label>
        <input
          type="file"
          placeholder="Add Product Images"
          multiple
          className="mt-1 block w-full p-2 border border-gray-400 rounded"
          onChange={handleImageChange}
        />
        <input
          type="submit"
          value="Add product"
          className="ml-40 bg-blue-600 text-white py-2 px-4 rounded-lg"
        />
      </form>   
    </div>
  );
};

export default ProductForm;