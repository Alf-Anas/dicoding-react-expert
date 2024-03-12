import { Layout as LayoutANTD } from 'antd';

const { Footer: FooterANTD } = LayoutANTD;

const thisYear = new Date().getFullYear();

export default function Footer() {
  return (
    <FooterANTD className='text-center text-primary-color'>
      <p className='m-0'>
        © {thisYear != 2024 && '2024 - '}
        {thisYear} |{' '}
        <a
          href='https://geoit.dev'
          target='_blank'
          className='text-primary-color'
        >
          GeoIT Developer
        </a>
      </p>
    </FooterANTD>
  );
}
