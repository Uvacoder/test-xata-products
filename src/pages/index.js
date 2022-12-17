import Head from 'next/head';
import Image from 'next/image';
import { FaStar, FaCheck } from 'react-icons/fa';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';

import styles from '@styles/Home.module.scss';

export default function Home({ products, categories }) {
  return (
    <Layout>
      <Head>
        <title>Cool Store</title>
        <meta name="description" content="My shows tracked!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="sr-only">My Cool Store</h1>

      <Section>
        <Container className={styles.homeContainer}>
          <div className={styles.sidebar}>
            <form>
              <div className={`${styles.sidebarSection} ${styles.sidebarSearch}`}>
                <h2><label>Search</label></h2>
                <input type="search" />
              </div>
              <div className={`${styles.sidebarSection} ${styles.sidebarCategories}`}>
                <h2>Categories</h2>
                <ul className={styles.checklist}>
                  { categories.map(category => {
                    return (
                      <li key={category}>
                        <label className={styles.checkbox}>
                          <input className="sr-only" type="checkbox" />
                          <span><FaCheck /></span>
                          { category }
                        </label>
                      </li>
                    )
                  }) }
                </ul>
              </div>
            </form>
          </div>

          <h2 className="sr-only">Products</h2>

          <ul className={styles.products}>
            {products.map(product => {
              return (
                <li key={product.id}>
                  <a className={styles.productImageWrapper} href={product.url} rel="noopener noreferrer">
                    <Image width="370" height="640" src={product.image} alt={`${product.name} Poster`} />
                  </a>
                  <h3 className={styles.productsTitle}>
                    <a href={product.url} rel="noopener noreferrer">{ product.title }</a>
                  </h3>
                  <p className={styles.productRating}>
                    <FaStar /> { product.rating_rate } ({ product.rating_count })
                  </p>
                  <p className={styles.productPrice}>
                    ${ (product.price / 100).toFixed(2)}
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
  const productData = await fetch('https://fakestoreapi.com/products').then(r => r.json());

  const products = productData.map(item => {
    const product = {
      ...item,
      rating_rate: item.rating.rate,
      rating_count: item.rating.count,
      price: item.price * 100
    }

    delete product.rating;
    delete product.description;

    return product;
  });

  const categories = Array.from(new Set(products.map(({ category }) => category)));

  return {
    props: {
      products,
      categories
    }
  }
}