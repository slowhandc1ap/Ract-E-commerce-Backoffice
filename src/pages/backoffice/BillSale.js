import { useEffect, useState } from "react";
import BackOffice from "../../components/BackOffice";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../config";
import dayjs  from 'dayjs' 
import MyModal from '../../components/MyModal'

function BillSale() {
    const [billsales, setBillSales] = useState([]) ;
    const [billSaleDetail , setBillSalesDetail] = useState([]) ;
    const [sumPrice , setSumPrice] = useState(0) ; 
    
    useEffect(() => {
        fetchData() ; 
    },[]); 

    const fetchData = async ()=> {
        try {
            const res = await axios.get(config.apiPath + '/api/sale/list' , config.headers());

            if(res.data.results !== undefined) setBillSales(res.data.results) ; 
                
        } catch (e) {
            Swal.fire({
                title : 'error' ,
                text : e.message,
                icon  : 'error'
            })
        }
    }
    const openModalInfo = async(item)=>{
        try {
            const res = await axios.get(config.apiPath + '/api/sale/billInfo/' + item.id , config.headers()) ;

            if(res.data.results !== undefined) {
                if(res.data.results !== undefined) setBillSalesDetail(res.data.results) ; 
            }
            let mySumPrice = 0  ;
            for (let i = 0 ; i < res.data.results.length ; i++ ){
                mySumPrice += parseInt(res.data.results[i].price)
            }
            setSumPrice(mySumPrice)
        } catch (e) {
            Swal.fire({
                title: 'error' , 
                text: e.message,
                icon: 'error'
            })
        }
    }
  return (
    <BackOffice>
      <div className="card">
        <div className="card-header">รายงานยอดขาย</div>
        <div className="card-body">
            <table className="table table-bordered table-striped">
              <thead>
                <th>ลูกค้า</th>
                <th>เบอร์โทร</th>
                <th>ที่อยู่</th>
                <th>วันที่ชำระเงิน</th>
                <th>เวลา</th>
                <th width='540px' ></th>
              </thead>

              <tbody>
                {billsales.length > 0 ? billsales.map(item => 
                <tr key={item.id}>
                    <td>{item.customerName}</td>
                    
                    <td>{item.customerPhone}</td>
                    <td>{item.customerAddress}</td>
                    <td>{dayjs(item.payDate).format('DD/MM/YYYY')}</td>
                    <td>{item.payTime}</td>
                    <td className="">
                        <button className="btn btn-secondary mr-1" 
                            data-toggle='modal' data-target='#modalInfo' onClick={e => openModalInfo(item)}>
                            <i className="fa fa-file-alt mr-2" ></i>รายละเอียด
                        </button>
                        <button className="btn btn-info mr-1">
                            <i className="fa fa-check mr-2"></i> ได้รับการชำระเเล้ว
                        </button>
                        <button className="btn btn-success mr-1">
                            <i className="fa fa-file mr-2"></i> จัดส่งเเล้ว
                        </button>
                        <button className="btn btn-danger mr-1">
                            <i className="fa fa-times mr-2"></i> ยกเลิก
                        </button>
                    </td>
                </tr>
                ):<></>}
              </tbody> 
            </table>
        </div>
      </div>

      <MyModal id='modalInfo' title="รายการของบิล">
        <table className="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>รายการ</th>
                    <th className="text-right" >ราคา</th>
                    <th className="text-right" >จำนวน</th>
                </tr>
            </thead>
            <tbody>
                {billSaleDetail.length > 0 ? billSaleDetail.map(item => 
                <tr key={item.id}>
                    <td>{item.Product.name}</td>
                    <td className="text-right">{item.price.toLocaleString('th-TH')}</td>
                    <td className="text-right">1</td>
                </tr>
                ):<></>}
            </tbody>
            
        </table>
        <div className="text-center mt-3 ">
                ยอดรวม {sumPrice.toLocaleString('th-TH')} บาท
            </div>
      </MyModal>
    </BackOffice>
  );
}

export default BillSale;
