import React from 'react';
import styled from 'styled-components';
import HomeBanner from '../module/home/HomeBanner';
import Layout from '../components/layout/Layout';
import HomeNewest from '../module/home/HomeNewest';
import HomeFeature from '../module/home/HomeFeature';

const HomePageStyles = styled.div`

`

const HomePage = () => {
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