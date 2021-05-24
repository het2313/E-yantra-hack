import React from 'react';
import Autosuggest from 'react-autosuggest';
import './autosuggest.css';

class ServerAutoSuggest extends React.Component {
	constructor(props) {
		super(props);

		//Define state for value and suggestion collection
		this.state = {
			value: '',
			suggestions: [],
		};
	}

	// Filter logic
	getSuggestions = async (value) => {
		const inputValue = value.trim().toLowerCase();
		let response = await fetch(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
				inputValue
			)}.json?access_token=pk.eyJ1IjoiaGV0LXBhdGVsIiwiYSI6ImNrb3FxMjQ1cDB4cGsycGw0dHh1Zzc5YnQifQ.Bn3AwbxQpIJbmiDglpZoQA&cachebuster=1621610386094&autocomplete=true&worldview=in`
		);
		let data = await response.json();
		return data;
	};

	// Trigger suggestions
	getSuggestionValue = (suggestion) => suggestion['place_name'];

	// Render Each Option
	renderSuggestion = (suggestion) => (
		<span>
			<span>{suggestion['place_name']}</span>
		</span>
	);

	// OnChange event handler
	onChange = (event, { newValue }) => {
		this.setState({
			value: newValue,
		});
	};

	// Suggestion rerender when user types
	onSuggestionsFetchRequested = ({ value }) => {
		this.getSuggestions(value).then((data) => {
			if (data.Error) {
				this.setState({
					suggestions: [],
				});
			} else {
				this.setState({
					suggestions: data['features'],
				});
				console.log(data['features']);
			}
		});
	};

	// Triggered on clear
	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: [],
		});
	};

	render() {
		const { value, suggestions } = this.state;

		// Option props
		const inputProps = {
			className: 'input',
			placeholder: 'Search Location',
			value,
			onChange: this.onChange,
		};

		// Adding AutoSuggest component
		return (
			<Autosuggest
				suggestions={suggestions}
				onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
				onSuggestionsClearRequested={this.onSuggestionsClearRequested}
				getSuggestionValue={this.getSuggestionValue}
				renderSuggestion={this.renderSuggestion}
				onSuggestionSelected={(
					event,
					{ suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
				) => {
					this.props.setViewport({
						latitude: suggestion.center[1],
						longitude: suggestion.center[0],
						position: 'absolute',
						top: 0,
						bottom: 0,
						width: '100%',
						height: '84vh',
						zoom: 13,
					});
					this.props.setNewview({
						latitude: suggestion.center[1],
						longitude: suggestion.center[0],
						position: 'absolute',
						top: 0,
						bottom: 0,
						width: '100%',
						height: '84vh',
						zoom: 13,
					});

					this.props.setOpen(false);
				}}
				inputProps={inputProps}
			/>
		);
	}
}

export default ServerAutoSuggest;
