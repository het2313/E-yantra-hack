import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function AddressForm({ form, setForm }) {
	const [state, setState] = useState('Gujarat');

	return (
		<React.Fragment>
			<Typography variant="h6" gutterBottom>
				Personal Details
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id="firstName"
						name="firstName"
						label="First name"
						color="secondary"
						fullWidth
						autoComplete="given-name"
						value={form.firstName}
						onChange={(e) => setForm({ ...form, ['firstName']: e.target.value })}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id="lastName"
						name="lastName"
						label="Last name"
						color="secondary"
						fullWidth
						autoComplete="family-name"
						value={form.lastName}
						onChange={(e) => setForm({ ...form, ['lastName']: e.target.value })}
					/>
				</Grid>

				<Grid item xs={12}>
					<TextField
						required
						id="address1"
						name="address1"
						label="Address"
						color="secondary"
						fullWidth
						autoComplete="shipping address-line1"
						value={form.address}
						onChange={(e) => setForm({ ...form, ['address']: e.target.value })}
					/>
				</Grid>

				<Grid item xs={12}>
					<TextField
						required
						id="address1"
						name="address1"
						label="Adhar-Card Number"
						type="number"
						color="secondary"
						fullWidth
						autoComplete="shipping address-line1"
						value={form.adharcard}
						onChange={(e) => setForm({ ...form, ['adharCard']: e.target.value })}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						required
						id="address1"
						name="address1"
						label="Mobile No."
						type="number"
						color="secondary"
						fullWidth
						autoComplete="shipping address-line1"
						value={form.mobileNo}
						onChange={(e) => setForm({ ...form, ['mobileNo']: e.target.value })}
					/>
				</Grid>

				<Grid item xs={12} sm={6}>
					<TextField
						required
						id="city"
						name="city"
						label="City"
						color="secondary"
						fullWidth
						autoComplete="shipping address-level2"
						value={form.city}
						onChange={(e) => setForm({ ...form, ['city']: e.target.value })}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						id="state"
						color="secondary"
						name="state"
						label="State/Province/Region"
						fullWidth
						value={form.state}
						onChange={(e) => setForm({ ...form, ['state']: e.target.value })}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id="zip"
						name="zip"
						label="Number"
						type="number"
						color="secondary"
						fullWidth
						autoComplete="shipping postal-code"
						value={form.pinCode}
						onChange={(e) => setForm({ ...form, ['pinCode']: e.target.value })}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id="country"
						name="country"
						label="Country"
						color="secondary"
						fullWidth
						autoComplete="shipping country"
						value={form.country}
						onChange={(e) => setForm({ ...form, ['country']: e.target.value })}
					/>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}
