import React, {useState, useEffect} from 'react'
import { FaCode } from "react-icons/fa";
import axios from 'axios';
import {Icon, Col, Card, Row} from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider'

function LandingPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.post('/api/product/products')
        .then(response => {
            if (response.data.success) {
                setProducts(response.data.productInfo);
                // 데이터가 넘어오는지 확인
                console.log(response.data);
                console.log(products);
            } else {
                alert("상품들을 가져오는데 실패했습니다.");
            }
        })
    }, [])
    
    const renderCards = products.map((product, index) => {
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card cover={<ImageSlider images={products.images}/>}>
                <Meta title={product.title} description={`$${product.price}`}/>
            </Card>
            </Col>
    })

    return (
        <div style={{width:'75%', margin: '3rem auto'}}>
            <div style={{textAlign: 'center' }}>
                <h2>Let's Travel Anywhere </h2>
            </div>

            <Row gutter={[16, 16]}>
                {renderCards}
            </Row>

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <button>더보기</button>
            </div>
        </div>
    )
}

export default LandingPage
