import { makeObservable, observable, computed, action } from "mobx";
import { enableStaticRendering } from "mobx-react";
import { gql } from "@apollo/client";
import client from "../apollo-client";

const isServer = typeof window === "undefined";
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(isServer);

type SerializedCategoryStore = {
	categories: [Object]
};

type CreateCategoryInput = {
	name: String
}

const getAllCategories = async () => {
	try {
		const { data } = await client.query({
			query: gql`
				query Categories {
				 categories {
					_id,
					name
				 }
		}
  `,
		});
		console.log('data', data)
		return data
	}
	catch (error) {
		console.error("errorerror", error);
	}
}

export class CategoryStore {
	categories: [Object] | undefined
	constructor() {
		makeObservable(this)
	}
	hydrate(serializedStore: SerializedCategoryStore) {
		this.categories = serializedStore.categories != null ? serializedStore.categories : [{}];
	}

	@action
	async fetchCategories() {
		const data = await getAllCategories();
		console.log("data", data);
		this.categories = data.categories;
	}

	@action
	async createCategory(input) {
		console.log("input", input)
		const { name } = input;
		try {

			const { data } = await client.mutate({
				mutation: gql`
				  mutation CreateCategory($input: CreateCategoryInput!) {
						createCategory(input: $input) {
							name
						}
				}
				`,
				variables: {
					"input": {
						name
					}
				}
			});
			return data
		}
		catch (error) {
			console.error("errorerror", error);
		}
	}
}

export async function fetchInitialCategoryStoreState() {
	const data = await getAllCategories();
	console.log("initData", data)
	return { categories: data.categories };
}