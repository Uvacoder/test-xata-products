import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { FaStar, FaCheck } from 'react-icons/fa';
import { useDebouncedCallback } from 'use-debounce';

import { getXataClient } from '@lib/xata';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';

import styles from '@styles/Home.module.scss';

export default function Home({ products, categories: defaultCategories }) {
  const [query, setQuery] = useState();
  const [searchResults, setSearchResults] = useState();
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState();

  const debouncedSetQuery = useDebouncedCallback((value) => setQuery(value), 500);

  const activeProducts = searchResults?.length ? searchResults : products;
  const activeCategories = categories.sort((a, b) => {
    if( a.name > b.name ) {
      return 1;
    }
    if ( a.name < b.name ) {
      return -1;
    }
    return 0;
  });

  useEffect(() => {
    if ( ( !query || query.length < 3) && !selectedCategory ) {
      setSearchResults(undefined);
      return;
    }

    (async function run() {
      const { products } = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify({
          query,
          category: selectedCategory
        })
      }).then(r => r.json());
      setSearchResults(products);
    })();
  }, [query, selectedCategory]);

  useEffect(() => {
    (async function run() {
      const { categories } = await fetch('/api/categories').then(r => r.json());
      setCategories(categories);
    })();
  }, []);

  function handleOnSearch(e) {
    debouncedSetQuery(e.currentTarget.value);
  }

  function handleOnCategorySelect(e) {
    const radio = Array.from(e.currentTarget.elements).find(({ checked }) => checked);
    setSelectedCategory(radio.value);
  }

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
            <div className={`${styles.sidebarSection} ${styles.sidebarSearch}`}>
              <form>
                <h2><label>Search</label></h2>
                <input type="search" onChange={handleOnSearch} />
              </form>
            </div>
            <div className={`${styles.sidebarSection} ${styles.sidebarCategories}`}>
              <h2>Categories</h2>
              <form onChange={handleOnCategorySelect}>
                <ul className={styles.checklist}>
                  <li>
                    <label className={styles.radio}>
                      <input className="sr-only" type="radio" name="category" value={false} defaultChecked />
                      <span><FaCheck /></span>
                      all ({ products.length })
                    </label>
                  </li>
                  { activeCategories.map(category => {
                    return (
                      <li key={category.name}>
                        <label className={styles.radio}>
                          <input className="sr-only" type="radio" name="category" value={category.name} />
                          <span><FaCheck /></span>
                          { category.name }
                          { category.count && ` (${category.count})`}
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
            {activeProducts.map(product => {
              return (
                <li key={product.id}>
                  <a className={styles.productImageWrapper} href={product.url} rel="noopener noreferrer">
                    <Image width="370" height="640" src={product.image} alt={`${product.name} Poster`} />
                  </a>
                  <h3 className={styles.productsTitle}>
                    <a href={product.url} rel="noopener noreferrer">{ product.title }</a>
                  </h3>
                  <p className={styles.productRating}>
                    <FaStar /> { product.ratingRate } ({ product.ratingCount })
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
  const xata = getXataClient();
  const page = await xata.db.products.getPaginated();
  const products = page.records;

  const categories = Array.from(new Set(products.map(({ category }) => category)))
    .map(category => {
      return {
        name: category
      }
    });

  return {
    props: {
      products,
      categories
    }
  }
}