import Head from 'next/head'
import Link from 'next/Link'
import { Button } from 'react-bootstrap';
import { Layout } from '../../layouts/main';
import { useEffect } from 'react';
import {gql} from '@apollo/client';
import client from '../../apollo-client';

export default function articleDetail({}) {
	// useEffect(()=>{
	// 	PortfolioStore.fetchPortfolios(UserStore.currentUser._id)
	// },[])
	return (
		<Layout>
			<div>Ticker Detail</div>
		</Layout>
	)
}

export async function getStaticProps() {
    const { data } = await client.query({
      query: gql`
        query Countries {
          countries {
            code
            name
            emoji
          }
        }
      `,
    });

    return {
      props: {
        countries: data.countries.slice(0, 4),
      },
   };
}