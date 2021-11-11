import { makeObservable, observable, computed, action } from "mobx";
import { enableStaticRendering } from "mobx-react";
import { gql } from "@apollo/client";
import client from "../apollo-client";

const isServer = typeof window === "undefined";
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(isServer);

type SerializedArticleStore = {
	articles: [Object]
};

export class ArticleStore {
	articles: [Object] | undefined
	constructor() {
		makeObservable(this)
	}
	hydrate(serializedStore: SerializedArticleStore) {
		this.articles = serializedStore.articles != null ? serializedStore.articles : [{}];
	}
	// @action
	// changeTitle(newTitle: string) {
	// 	this.title = newTitle
	// }
	@action
	async createArticle(input) {
		console.log("input",input)
		const { authorCountry,
			createdAt,
			categories,
			title,
			content,
			authorName
		} = input;
		const { data } = await client.mutate({
			mutation: gql`
			  mutation createArticle(
					$createdAt: String!,
					$title: String!
  					$categories: [String!]!
					authorCountry: String!
					authorName: String!
					content: String!
					createdAt: String! ) {
					createArticle(
						title: $title
						categories: $categories					  
						authorCountry: $authorCountry
						authorName: $authorName
						content: $content
						createdAt: $createdAt) {
						}
			}
			`,
			variables: {
				authorCountry,
				createdAt,
				categories,
				title,
				content,
				authorName
			}
		});
		console.log("data",data)
	}
}

export async function fetchInitialArticleStoreState() {

	return {};
}