import { render } from '@testing-library/react';
import Form from './Form';

const countryOptions = ["Canada"];
const regionOptions = ["ON", "BC"];
const positionOptions = ["Data Analyst"];

test('renders the form with correct props', () => {
    render(<Form countryOptions={countryOptions} regionOptions={regionOptions} positionOptions={positionOptions}/>);
});