import Head from 'next/head';
import Image from 'next/image';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Product.module.scss';

import amazonProducts from '@data/amazoncom-sample-50.csv';

export default function Product({ product }) {
  return (
    <Layout>
      <Head>
        <title>{ `${product.productName} - My Cool Store` }</title>
        <meta name="description" content={`${product.productName} at My Cool Store`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container className={styles.productContainer}>

          <div>
            <Image className={styles.productImage} width="370" height="640" src={product.image} alt={`${product.productName} Poster`} />
          </div>
          
          <div>
            <p className={styles.productCategory}>
              {product.category}
            </p>

            <h1>{ product.productName }</h1>
            
            <p className={styles.productPrice} data-is-sale={product.salePrice && product.salePrice !== product.sellingPrice}>
              {product.salePrice && (<span className={styles.productPriceSale}>{product.salePrice}</span>)}
              <span className={styles.productPriceSelling}>{product.sellingPrice}</span>
            </p>

            <Button href={product.url} rel="noopener noreferrer">Buy Now</Button>
          </div>

        </Container>
      </Section>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const amazonProduct = amazonProducts.find(product => product['Uniq Id'] === params.productId);

  const product = {
    id: amazonProduct['Uniq Id'],
    productName: amazonProduct['Product Name'],
    category: amazonProduct['Category'],
    sellingPrice: amazonProduct['Selling Price'],
    image: amazonProduct['Image'],
    productUrl: amazonProduct['Product Url'],
  };

  // product.salePrice = `$${(parseFloat(product.sellingPrice.replace('$', '')) * .8).toFixed(2)}`;

  return {
    props: {
      product
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  }
}