import { render } from '@testing-library/react';
import Form from './Form';

const countryOptions = ["Canada"];
const regionOptions = ["ON", "BC"];
const positionOptions = ["Data Analyst"];

test('renders the form with correct props', () => {
    render(<Form countryOptions={countryOptions} regionOptions={regionOptions} positionOptions={positionOptions}/>);
});

test('renders the form without countryOptions props', () => {
    expect(() => render(<Form regionOptions={regionOptions} positionOptions={positionOptions}/>))
        .toThrow("Cannot read properties of undefined (reading 'map')")
});

test('renders the form without regionOptions props', () => {
    expect(() => render(<Form countryOptions={countryOptions} positionOptions={positionOptions}/>))
        .toThrow("Cannot read properties of undefined (reading 'map')")
});

test('renders the form without positionOptions props', () => {
    expect(() => render(<Form regionOptions={regionOptions} countryOptions={countryOptions}/>))
        .toThrow("Cannot read properties of undefined (reading 'map')")
});
