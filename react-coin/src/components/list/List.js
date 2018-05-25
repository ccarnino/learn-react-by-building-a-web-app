import React from 'react';
import { handleResponse } from '../../helpers';
import { API_URL } from '../../config';
import Loading from '../common/Loading';
import Table from './Table';
import Pagination from './Pagination';


class List extends React.Component {

    constructor() {
        super();

        this.state = {
            loading: false,
            currencies: [],
            error: null,
            totalPages: 0,
            page: 1,
        };

        this.handlePaginationClick = this.handlePaginationClick.bind(this);
    }


    componentDidMount() {
        this.fetchCurrencies()
    }


    fetchCurrencies() {
        this.setState({ loading: true });

        const { page } = this.state;

        fetch(`${API_URL}/cryptocurrencies?page=${page}&perPage=20`)
            .then(handleResponse)
            .then((data) => {
                const {currencies, totalPages, page} = data;

                this.setState({
                    loading: false,
                    currencies,
                    totalPages,
                    page,
                });
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    error: error.errorMessage
                });
            });
    }


    handlePaginationClick(direction) {
        let nextPage = this.state.page;

        // If the direction is next, increase the page. Otherwise decrease it.
        nextPage = direction === 'next' ? nextPage + 1 : nextPage - 1;

        this.setState({page: nextPage}, () => {
            this.fetchCurrencies()
        });
    }


    render() {
        const { loading, currencies, error, totalPages, page } = this.state;

        // Display when loading data
        if (loading) {
            return <div className="loading-container"><Loading /></div>
        }

        // Display when en error occurrs when fetching data
        if (error) {
            return <div className="error">{error}</div>
        }

        return (
            <div>
                <Table currencies={currencies} />
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    handlePaginationClick={this.handlePaginationClick}
                />
            </div>
        );
    }
}


export default List;
