import React, { useEffect } from 'react';
import styled from 'styled-components';
import HomeBanner from '../module/home/HomeBanner';
import Layout from '../components/layout/Layout';
import HomeNewest from '../module/home/HomeNewest';
import HomeFeature from '../module/home/HomeFeature';
import Swal from 'sweetalert2';

const HomePageStyles = styled.div`

`

const HomePage = () => {
    useEffect(() => {
        document.title = "Monkey Blogging"
    }, [])

    useEffect(() => {
        const Toast = Swal.mixin({

        });
        Toast.fire({
            title: "<h2>Thông tin tài khoản Demo</h2>",
            icon: "info",
            html: `
                <div>
                    <div className="flex flex-col justify-start items-start">
                        <h3 className="font-bold">Tài khoản Admin:</h3>
                        <div className="m-5 flex flex-col justify-start items-start">
                            <div>Email: 2051052019duy@ou.edu.vn</div>                        
                            <div>Password: 123456789</div>
                        </div>
                    </div>
                    <div className="mt-5 flex flex-col justify-start items-start">
                        <h3 className="font-bold">Tài khoản User:</h3>
                        <div className="m-5 flex flex-col justify-start items-start">
                            <div>Email: duyngoc123@gmail.com</div>                        
                            <div>Password: 123456789</div>
                        </div>
                    </div>
                </div>
            `,
        });
    }, [])
    return (
        <HomePageStyles>
            <Layout>
                <HomeBanner></HomeBanner>
                <HomeFeature></HomeFeature>
                <HomeNewest></HomeNewest>
            </Layout>
        </HomePageStyles>
    );
};

export default HomePage;