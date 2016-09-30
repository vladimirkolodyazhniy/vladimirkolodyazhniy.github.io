const CardFlipper = React.createClass({
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

        const {
            frontImgSrc,
            backImgSrc,
        } = this.props;

        return (
            <div className="flex__holder">
                <div className={flipped ? "flipped flip__container" : "flip__container"} onClick={this.handleClick}>
                    <div className="flipper">
                        <div className="front">
                            <img className="flipper__img" src={frontImgSrc} alt="logo"/>
                        </div>
                        <div className="back">
                            <img className="flipper__img" src={backImgSrc} alt="title"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <CardFlipper
        frontImgSrc='https://facebook.github.io/react/img/logo.svg'
        backImgSrc='http://3.bp.blogspot.com/-FWllqU6BXKg/VVnbUyqoBcI/AAAAAAAAN8Q/rVidBpUF9RY/s1600/reactjs.png'
    />,
    document.getElementById('root')
);
