import { render } from '@testing-library/react';
import DashboardFilter from './DashboardFilter';

const countryOptions = ["Canada"];
const regionOptions = ["ON", "BC"];
const positionOptions = ["Data Analyst"];

test('renders the form with correct props', () => {
    render(<DashboardFilter countryOptions={countryOptions} regionOptions={regionOptions} positionOptions={positionOptions}/>);
});