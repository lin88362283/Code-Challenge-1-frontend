import App from "next/app";
import React from "react";
import { Provider } from "mobx-react";
import { fetchInitialArticleStoreState, ArticleStore } from "../stores/ArticleStore";
import { fetchInitialCategoryStoreState, CategoryStore } from "../stores/CategoryStore";

class MyApp extends App {
  state = {
    articleStore: new ArticleStore(),
    categoryStore: new CategoryStore(), 
  };

  // Fetching serialized(JSON) store state
  static async getInitialProps(appContext) {
    const appProps = await App.getInitialProps(appContext);
    const initialArticleStoreState = await fetchInitialArticleStoreState();
    const initialCategoryStoreState = await fetchInitialCategoryStoreState();

    return {
      ...appProps,
      initialArticleStoreState,
      initialCategoryStoreState
    };
  }

  // Hydrate serialized state to store
  static getDerivedStateFromProps(props, state) {
    state.articleStore.hydrate(props.initialArticleStoreState);
    state.categoryStore.hydrate(props.initialCategoryStoreState);
    return state;
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider articleStore={this.state.articleStore} categoryStore={this.state.categoryStore}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}
export default MyApp;