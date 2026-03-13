
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/App.css";

export default function App() {
	return (
		<BrowserRouter>
			<div className="app-container">
				<Routes>
					<Route
						path="/"
						element={
							<div className="p-8">
								<h1>Hash Table Tutorial</h1>
							</div>
						}
					/>
				</Routes>
			</div>
		</BrowserRouter>
	);
}
