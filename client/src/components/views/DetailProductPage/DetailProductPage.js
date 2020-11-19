import React, {useState, useEffect} from 'react';
import axios from 'axios';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import {Row, Col} from 'antd';

function DetailProductPage(props) {
    const productId = props.match.params.productId;
    const [product, setProduct] = useState({});

    useEffect(() => {
        
        axios.get(`/api/product/product_by_id?id=${productId}&type=single`)
        .then(response => {
            if(response.data.success) {
                setProduct(response.data.product[0]);
            } else {
                alert('상세 정보 가져오기를 실패했습니다.');
            }
        })
    }, [])

    return (
        <div>
            <div style={{width: '100%', padding: '3rem 4rem'}}>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <h1>{product.title}</h1>
                </div>
            </div>

            <br />

            <Row gutter={[16, 16]}>
                <Col lg={12} sm={24}><ProductImage detail={product}/></Col>
                <Col lg={12} sm={24}><ProductInfo detail={product}/></Col>
            </Row>
        </div>
    )
}

export default DetailProductPage;