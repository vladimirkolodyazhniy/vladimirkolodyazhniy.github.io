const Card = React.createClass({
    getInitialState() {
        return {
            flipped: false
        };
    },

    handleClick() {
        this.setState({ flipped: !this.state.flipped });
    },

    render() {
        const { flipped } = this.state;

        return (
            <div className="flex-holder">
                <div className={flipped ? "flipped flip-container" : "flip-container"} onClick={this.handleClick}>
                    <div className="flipper">
                        <div className="front">
                            <img src="https://facebook.github.io/react/img/logo.svg" alt="logo"/>
                        </div>
                        <div className="back">
                            <img src="http://3.bp.blogspot.com/-FWllqU6BXKg/VVnbUyqoBcI/AAAAAAAAN8Q/rVidBpUF9RY/s1600/reactjs.png" alt="title"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <Card />,
    document.getElementById('root')
);
