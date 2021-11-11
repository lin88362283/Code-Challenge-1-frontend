import Layout from "../components/Layout";
import { inject } from "mobx-react";
import { observer } from "mobx-react-lite";
import { NextPage } from "next";
import { ArticleStore } from "../../stores/ArticleStore";
import { CategoryStore } from "../../stores/CategoryStore";
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Button from '@material-ui/core/Button';
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, OutlinedInput } from "@material-ui/core";
import { COUNTRY_LIST } from "../../utils/constant";
import { useState } from "react";

type Props = {
	articleStore?: ArticleStore;
	categoryStore?: CategoryStore;
};

const ManagementPage: NextPage = inject("articleStore", "categoryStore")(
	observer((props: Props) => {
		const [country, setCountry] = useState('')
		const [date, setDate] = useState('')
		const [newCategory, setNewCategory] = useState('')
		const [categories, setCategories] = useState([''])
		const articleStore = props.articleStore!;
		const categoryStore = props.categoryStore!;

		const ITEM_HEIGHT = 48;
		const ITEM_PADDING_TOP = 8;
		const MenuProps = {
			PaperProps: {
				style: {
					maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
					width: 250,
				},
			},
		};

		const handleCategorySubmit = (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			const data = Object.fromEntries(new FormData(event.currentTarget));
			const formData = {
				name: data.newCategory
			}
			categoryStore.createCategory(formData)
		}
		const checkValidation = () =>{
			return false
		}
		const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			let data = Object.fromEntries(new FormData(event.currentTarget));
			// eslint-disable-next-line no-console
			data = {
				...data,
				authorCountry: country,
				createdAt: date,
				categories
			}
			articleStore.createArticle(data)
		};
		const handleCategoriesChange = (event: SelectChangeEvent) => {
			const {
				target: { value },
			} = event;
			setCategories(
				typeof value === 'string' ? value.split(',') : value,
			);
		};
		return (
			<Container
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="title"
						label="Article Title"
						name="title"

					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="authorName"
						label="Author Name"
						id="authorName"
					/>
					<Autocomplete
						id="authorCountry"
						sx={{ width: 300 }}
						options={COUNTRY_LIST}
						inputValue={country}
						onInputChange={(event, newInputValue) => {
							setCountry(newInputValue);
						}}
						autoHighlight
						getOptionLabel={(option: string) => option}
						renderOption={(props, option) => (
							<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
								{option}
							</Box>
						)}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Author Country"
								inputProps={{
									...params.inputProps
								}}
							/>
						)}
					/>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							label="Created At"
							value={date}
							onChange={(newValue: string | null) => {
								setDate(newValue);
							}}
							renderInput={(params) => <TextField {...params} />}
						/>
					</LocalizationProvider>
					<FormControl sx={{ m: 1, width: 300 }}>
						<InputLabel id="category-label">Category</InputLabel>
						<Select
							labelId="category-label"
							id="category"
							multiple
							value={categories}
							onChange={handleCategoriesChange}
							input={<OutlinedInput label="Category" />}
							MenuProps={MenuProps}
						>
							{categoryStore.categories?.map((category: string) => (
								<MenuItem
									key={category._id}
									value={category._id}
								>
									{category.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						margin="normal"
						required
						fullWidth
						multiline={true}
						name="content"
						label="Content"
						id="content"
					/>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
						// disabled={checkValidation}
					>
						Submit
					</Button>
				</Box>
				<Box component="form" onSubmit={handleCategorySubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						name="newCategory"
						label="Add New Category"
						id="category"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Add New Category
					</Button>
				</Box>
			</Container>
		);
	})
);
export default ManagementPage;