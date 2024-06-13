import { useEffect, useState, useRef } from "react";
import BackOffice from "../../components/BackOffice";
import MyModal from "../../components/MyModal";
import Swal from "sweetalert2";
import config from "../../config";
import axios from "axios";

function Product() {
  const [product, setProduct] = useState({}); // one product
  const [products, setProducts] = useState([]); // all product
  const [img, setImg] = useState({}); // file for upload
  const [fileExcel , setFileExcel] = useState({}) ; // file for excel file

  const refImg = useRef();
  const refExcel = useRef();

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      
      
      formData.append("img", img);
      console.log(formData);
      const res = await axios.post(
        config.apiPath + "/product/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // derfin for imgage
            "Authorization" : localStorage.getItem("token"),
          },
        }
      );
      if (res.data.newName !== undefined) {
        return res.data.newName;
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
      return "";
    }
  };
  //save data to database
  const handleSave = async () => {
    try {

      product.price = parseInt(product.price);
      product.cost = parseInt(product.cost);
      
      if (!isNaN(product.price) && !isNaN(product.cost)) {
        product.img = await handleUpload();
    }
 
     

      let res;

      if (product.id === undefined) {
        res = await axios.post(
          config.apiPath + "/product/create",
          product,
          config.headers()
        );
      } else {
        res = await axios.put(
          config.apiPath + "/product/update",
          product,
          config.headers()
        );
      }

      if (res.data.message === "success") {
        Swal.fire({
          title: "save",
          text: "success",
          icon: "success",
          timer: 2000,
        });
        document.getElementById("modalProduct_btnClose").click();
        fetchData();

        setProduct({ ...product, id: undefined }); // Clear id
      }
    } catch (error) {
      Swal.fire({
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };


  const fetchData = async () => {
    try {
      const res = await axios.get(
        config.apiPath + "/product/list",
        config.headers()
      );

      if (res.data.results !== undefined) {
        setProducts(res.data.results);
      }
    } catch (error) {
      Swal.fire({
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const clearForm = () => {
    setProduct({
      name: "",
      price: "",
      cost: "",
    });
    setImg({});
    refImg.current.value = ""; //set input file to null
    console.log(img);
  };

  const handleRomove = async (item) => {
    try {
      const button = await Swal.fire({
        text: "remove item",
        title: "remove",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      });
      if (button.isConfirmed) {
        const res = await axios.delete(
          config.apiPath + "/product/remove/" + item.id,
          config.headers()
        );

        if (res.data.message === "success") {
          Swal.fire({
            title: "remove",
            text: "Success",
            icon: "success",
            timer: 1000,
          });
          fetchData();
        }
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        textt: e.message,
        icon: "error",
      });
    }
  };

  const selectedFile = (inputFile) => {
    if (inputFile !== undefined) {
      if (inputFile.length > 0) {
        setImg(inputFile[0]);
      }
    }
  };

  const showImage = (item) => {
    if (item.img !== "") {
      return (
        <img
          alt=""
          className="img-fluid"
          src={config.apiPath + "/uploads/" + item.img}
        />
      );
    }
    return <></>;
  };

  // funtion for upload Excel
  const selectedFileExcel = (fileInput) => {
    if (fileInput !== undefined) {
      if (fileInput.length > 0 ) {
        setFileExcel(fileInput[0])
      }
    }
  };

  const handleUploadExcel = async () => {
    try {
      const formData = new FormData();
      formData.append('fileExcel', fileExcel);

      const res = await axios.post(config.apiPath + '/product/uploadFromExcel' , formData , 
        {
          headers: {
            "Content-Type": "multipart/form-data", // derfin for imgage
            "Authorization" : localStorage.getItem("token"),
          },
        }
    )
      if(res.data.message === "success" ) {
        Swal.fire({
          title : 'upload file'  ,
          text: 'upload sucess',
          icon : 'success',
          timer : 1000 
        })
        fetchData();
        document.getElementById('modalExcel_btnClose').click();
      }
    } catch (e) {
      Swal.fire({
        title: 'error',
        text: e.message ,
        icon : "error"
      })
    }
  };

  const clearFormExcel = () => {
    refExcel.current.value = "" ; 
    setFileExcel(null) ;
  };

  return (
    <BackOffice>
      <div className="h4">Product</div>
      <button
        onClick={clearForm}
        className="btn btn-primary mr-2"
        data-toggle="modal"
        data-target="#modalProduct"
      >
        <i className="fa fa-plus"></i> เพิ่มรายการ
      </button>
      <button
        onClick={clearFormExcel}
        className="btn btn-success"
        data-toggle="modal"
        data-target="#modalExcel"
      >
        <i className="fa fa-arrow-down mr-2 "></i>Import from excel
      </button>

      {/* Product List */}
      <table className="mt-3 table table-bordered table-striped">
        <thead>
          <tr>
            <th width="150px">ภาพสินค้า</th>
            <th>name</th>
            <th width="150px" className="text-right">
              cost
            </th>
            <th width="150px" className="text-right">
              price
            </th>
            <th width="140px"></th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((item) => (
              <tr key={item.id}>
                <td>{showImage(item)}</td>
                <td>{item.name}</td>
                <td className="text-right">{item.cost}</td>
                <td className="text-right">{item.price}</td>
                <td className="text-center">
                  <button
                    className="btn btn-primary mr-2"
                    data-toggle="modal"
                    data-target="#modalProduct"
                    onClick={(e) => setProduct(item)} // item = product.map (=> item)
                  >
                    <i className="fa fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={(e) => handleRomove(item)}
                  >
                    <i className="fa fa-times"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </table>

      {/* modal Product */}
      <MyModal id="modalProduct" title="product">
        <div>
          <div>ชื่อสินค้า</div>
          <input
            value={product.name}
            className="form-control"
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </div>
        <div className="mt-3">
          <div>ราคาทุน</div>
          <input
            value={product.cost}
            className="form-control"
            onChange={(e) => setProduct({ ...product, cost: e.target.value })}
          />
        </div>
        <div className="mt-3">
          <div>ราคาขาย</div>
          <input
            value={product.price}
            className="form-control"
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
        </div>
        <div className="mt-3">
          <div className="mb-3">  {showImage(product)} </div>
          <div>ภาพสินค้า</div>
          {/* selectedfile is functions */}
          <input
            className="form-control"
            type="file"
            ref={refImg}
            onChange={(e) => selectedFile(e.target.files)}
          />
        </div>
        <div className="mt-3">
          <button className="btn btn-primary" onClick={handleSave}>
            <i className="fa fa-check mr-2"></i> save
          </button>
        </div>
      </MyModal>

      {/* modal EXCEL */}
      <MyModal yModal id="modalExcel" title="chosen a file">
        <div>เลือกไฟล์</div>
        <input
          className="form-control"
          ref={refExcel}
          onChange={(e) => selectedFileExcel(e.target.files)}
          type="file"
        />

        <button className="mt-3 btn btn-primary" onClick={handleUploadExcel}>
          <i className="fa fa-check mr-2"></i>Save
        </button>
      </MyModal>
    </BackOffice>
  );
}
export default Product;
