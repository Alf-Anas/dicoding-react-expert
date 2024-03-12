'use client';

import React, { ReactNode } from 'react';
import { Button, Dropdown, Layout, Radio, Typography, theme } from 'antd';
import MyImage from '@/components/MyImage';
import {
  ClusterOutlined,
  UserOutlined,
  FireOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import { ROUTE } from '@/constants';
import { usePathname, useRouter } from 'next/navigation';
import Footer from './Footer';

const { Header, Content } = Layout;

const navigationItems = [
  {
    key: ROUTE.HOME,
    label: (
      <>
        <FireOutlined /> Threads
      </>
    ),
  },
  {
    key: ROUTE.LEADERBOARDS,
    label: (
      <>
        <ClusterOutlined /> LeaderBoards
      </>
    ),
  },
  {
    key: ROUTE.PROFILE,
    label: (
      <>
        <UserOutlined /> Profile
      </>
    ),
  },
];

export default function MainLayout({ children }: { children: ReactNode }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const pathname = usePathname();

  const onChangeNavigation = (e: RadioChangeEvent) => {
    router.push(e.target.value);
  };

  return (
    <Layout className='min-h-screen'>
      <Header className='py-2 px-6 z-[5] h-min shadow-sm bg-primary-color sticky top-0'>
        <div className='justify-between flex'>
          <div className='inline-flex items-center'>
            <MyImage
              src='/img/logo.png'
              alt='logo'
              className='h-[40px] mx-4'
              style={{
                filter:
                  'invert(1) sepia(0) saturate(0) brightness(10) grayscale(1)',
              }}
            />
            <Typography.Text className='font-bold text-white text-2xl'>
              OPEN FORUM
            </Typography.Text>
          </div>
          <div className='inline-flex items-center'>
            <Radio.Group
              value={pathname}
              onChange={onChangeNavigation}
              size='middle'
              buttonStyle='solid'
              className='hidden md:block'
            >
              {navigationItems.map((navItem) => (
                <Radio.Button value={navItem.key} key={navItem.key}>
                  {navItem.label}
                </Radio.Button>
              ))}
            </Radio.Group>
            <Dropdown
              className='block md:hidden'
              menu={{
                items: navigationItems.map((navItem) => {
                  return {
                    label: (
                      <Button
                        type={navItem.key === pathname ? 'primary' : undefined}
                        className='w-full'
                        onClick={() => router.push(navItem.key)}
                      >
                        {navItem.label}
                      </Button>
                    ),
                    key: navItem.key,
                  };
                }),
              }}
              trigger={['click']}
            >
              <Button
                icon={<MenuOutlined />}
                size='large'
                className='bg-white'
              />
            </Dropdown>
          </div>
        </div>
      </Header>

      <Content className='p-8 max-w-3xl mx-auto w-full'>
        <div
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className='p-4'
        >
          {children}
        </div>
      </Content>
      <Footer />
    </Layout>
  );
}
