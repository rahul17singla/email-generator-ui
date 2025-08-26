import { useState } from "react";
import axios from "axios";
import {
	Container,
	TextField,
	Typography,
	Button,
	Box,
	Card,
	CardContent,
	MenuItem,
	CircularProgress,
	Snackbar,
	Alert,
	Autocomplete,
	Grid,
	IconButton,
	Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function App() {
	const [email, setEmail] = useState("");
	const [tone, setTone] = useState("");
	const [response, setResponse] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [copied, setCopied] = useState(false);

	const predefinedTones = ["Formal", "Casual", "Friendly", "Professional"];

	const handleGenerate = async () => {
		if (!email) {
			setError("Please enter the email content!");
			return;
		}
		if (!tone) {
			setError("Please enter or select a tone!");
			return;
		}
		setLoading(true);

		try {
			setResponse("Generating response...");

			const res = await axios.post(import.meta.env.VITE_API_URL, {
				emailContent: email,
				tone,
			});

			setResponse(res.data);
		} catch (err) {
			setResponse("");
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(response);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Container maxWidth="lg" sx={{ mt: 5 }}>
			<Typography
				variant="h3"
				gutterBottom
				align="center"
				fontWeight="bold"
				color="purple"
			>
				Email Response Generator
			</Typography>

			<Grid
				container
				spacing={4}
				sx={{ mt: 2 }}
				justifyContent={"space-between"}
			>
				{/* Left Side - Input Form */}
				<Grid item xs={12} md={6} width={"47%"}>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 3,
						}}
					>
						{/* Email Input */}
						<TextField
							fullWidth
							label="Enter the email content"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							multiline
							minRows={10}
							maxRows={10}
							sx={{
								"& .MuiOutlinedInput-root": {
									"& fieldset": {
										borderColor: "purple",
									},
									"&:hover fieldset": {
										borderColor: "purple",
									},
									"&.Mui-focused fieldset": {
										borderColor: "purple",
									},
								},
								"& .MuiInputLabel-root": {
									color: "purple",
								},
								"& .MuiInputLabel-root.Mui-focused": {
									color: "purple",
								},
							}}
						/>

						{/* Tone Selector (Autocomplete with free input) */}
						<Autocomplete
							freeSolo
							options={predefinedTones}
							value={tone}
							onChange={(_, newValue) => setTone(newValue)}
							onInputChange={(_, newInputValue) =>
								setTone(newInputValue)
							}
							sx={{
								"& .MuiOutlinedInput-root": {
									"& fieldset": {
										borderColor: "purple",
									},
									"&:hover fieldset": {
										borderColor: "purple",
									},
									"&.Mui-focused fieldset": {
										borderColor: "purple",
									},
								},
								"& .MuiInputLabel-root": {
									color: "purple",
								},
								"& .MuiInputLabel-root.Mui-focused": {
									color: "purple",
								},
							}}
							slotProps={{
								paper: {
									sx: {
										backgroundColor: "#f9eef9",
										color: "purple",
										border: "1px solid purple",
									},
								},
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Select or enter the tone"
									variant="outlined"
									fullWidth
								/>
							)}
						/>

						{/* Generate Button */}
						<Box sx={{ textAlign: "center" }}>
							<Button
								variant="contained"
								onClick={handleGenerate}
								disabled={loading}
								fullWidth
								sx={{
									px: 4,
									py: 1.2,
									borderRadius: "10px",
									backgroundColor: `${
										loading ? "grey" : "purple"
									}`,
								}}
							>
								{loading ? (
									<CircularProgress
										size={24}
										color="inherit"
									/>
								) : (
									"Generate"
								)}
							</Button>
						</Box>
					</Box>
				</Grid>

				{/* Right Side - Response Display */}
				<Grid item xs={12} md={6} width={"47%"}>
					<Card
						sx={{
							minHeight: 200,
							boxShadow: 3,
							borderRadius: "12px",
							backgroundColor: "#f9eef9",
							border: "1px solid purple",
							height: "100%",
						}}
					>
						<CardContent>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<Typography
									variant="h6"
									gutterBottom
									sx={{ color: "purple", fontWeight: "bold" }}
								>
									Generated Response:
								</Typography>
								<Tooltip
									title={copied ? "Copied!" : "Copy text"}
								>
									<IconButton
										size="small"
										onClick={handleCopy}
										sx={{ color: "purple" }}
									>
										<ContentCopyIcon fontSize="small" />
									</IconButton>
								</Tooltip>
							</Box>
							<Typography
								variant="body1"
								sx={{ color: "purple" }}
							>
								{response ||
									"Click Generate to see the response"}
							</Typography>
						</CardContent>
					</Card>
					<Typography
						variant="caption"
						display="block"
						align="center"
						sx={{ mt: 1, color: "red", fontWeight: "bold" }}
					>
						⚠️ AI can make mistakes. Check important info.
					</Typography>
				</Grid>
			</Grid>

			{/* Error Snackbar */}
			<Snackbar
				open={!!error}
				autoHideDuration={3000}
				onClose={() => setError("")}
			>
				<Alert severity="error" onClose={() => setError("")}>
					{error}
				</Alert>
			</Snackbar>
		</Container>
	);
}
