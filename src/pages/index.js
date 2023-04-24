import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FaCheck } from 'react-icons/fa';
import { useDebouncedCallback } from 'use-debounce';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';

import styles from '@styles/Home.module.scss';

import amazonProducts from '@data/amazoncom-sample-50.csv';

export default function Home({ products, categories }) {
  const [searchQuery, setSearchQuery] = useState();
  const [searchCategory, setSearchCategory] = useState();

  // Add debouncing when setting query state to avoid making quick, repetitive
  // requests for every single letter typed

  const debouncedSetSearchQuery = useDebouncedCallback((value) => setSearchQuery(value), 250);

  /**
   * handleOnSearch
   */

  function handleOnSearch(e) {
    debouncedSetSearchQuery(e.currentTarget.value);
  }

  /**
   * handleOnCategorySelect
   */

  function handleOnCategorySelect(e) {
    const radio = Array.from(e.currentTarget.elements).find(({ checked }) => checked);
    setSearchCategory(radio.value);
  }

  return (
    <Layout>
      <Head>
        <title>Cool Store</title>
        <meta name="description" content="My cool store!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="sr-only">My Cool Store</h1>

      <Section>
        <Container className={styles.homeContainer}>
          <div className={styles.sidebar}>
            <div className={`${styles.sidebarSection} ${styles.sidebarSearch}`}>
              <form>
                <h2><label>Search</label></h2>
                <input type="search" name="query" onChange={handleOnSearch} />
              </form>
            </div>
            <div className={`${styles.sidebarSection} ${styles.sidebarCategories}`}>
              <h2>Categories</h2>
              <form onChange={handleOnCategorySelect}>
                <ul className={styles.checklist}>
                  <li>
                    <label className={styles.radio}>
                      <input className="sr-only" type="radio" name="category" value={undefined} defaultChecked />
                      <span><FaCheck /></span>
                      All
                    </label>
                  </li>
                  { categories.map(category => {
                    return (
                      <li key={category}>
                        <label className={styles.radio}>
                          <input className="sr-only" type="radio" name="category" value={category} />
                          <span><FaCheck /></span>
                          { category }
                        </label>
                      </li>
                    )
                  }) }
                </ul>
              </form>
            </div>
          </div>

          <h2 className="sr-only">Products</h2>

          <ul className={styles.products}>
            {products.map(product => {
              return (
                <li key={product.id}>
                  <Link className={styles.productImageWrapper} href={`/products/${product.id}`} rel="noopener noreferrer">
                    <Image width="370" height="640" src={product.image} alt={`${product.productName} Poster`} />
                  </Link>
                  <h3 className={styles.productsTitle}>
                    <Link href={`/products/${product.id}`} rel="noopener noreferrer">{ product.productName }</Link>
                  </h3>
                  <p className={styles.productPrice} data-is-sale={product.salePrice && product.salePrice !== product.sellingPrice}>
                    {product.salePrice && (<span className={styles.productPriceSale}>{product.salePrice}</span>)}
                    <span className={styles.productPriceSelling}>{product.sellingPrice}</span>
                  </p>
                </li>
              )
            })}
          </ul>
        </Container>
      </Section>
    </Layout>
  )
}

export async function getStaticProps() {
  const products = amazonProducts.map(product => {
    return {
      id: product['Uniq Id'],
      productName: product['Product Name'],
      category: product['Category'],
      sellingPrice: product['Selling Price'],
      image: product['Image'],
      productUrl: product['Product Url'],
      // salePrice: `$${(parseFloat(product['Selling Price'].replace('$', '')) * .8).toFixed(2)}`
    }
  });
  

  const categories = Array.from(new Set(products.map(({ category }) => category))).filter(c => !!c).sort();

  return {
    props: {
      products,
      categories
    }
  }
}