import Layout from "../components/Layout";
import { inject } from "mobx-react";
import { observer } from "mobx-react-lite";
import { NextPage } from "next";
import { ArticleStore } from "../stores/ArticleStore";

type Props = {
  articleStore?: ArticleStore;
};

const IndexPage: NextPage = inject("articleStore")(
  observer((props: Props) => {
    const articleStore = props.articleStore!;

    return (
      <Layout title="Home | Next.js + TypeScript Example">
        <h1>My first Medium article</h1>
      </Layout>
    );
  })
);
export default IndexPage;