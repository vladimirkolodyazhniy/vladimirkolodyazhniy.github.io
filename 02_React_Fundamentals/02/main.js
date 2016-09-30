const SCALE_FACTOR_MAX = 8;
const SCALE_FACTOR_STEP = 0.8;

const Clicker = React.createClass({
    getInitialState() {
        return {
            scaleFactor: 1
        };
    },

    handleClick() {
        this.setState({ scaleFactor: this.state.scaleFactor + SCALE_FACTOR_STEP });
    },

    resetScaleFactor() {
        this.state.scaleFactor > SCALE_FACTOR_MAX ? this.setState({ scaleFactor: 1 }) : this.state.scaleFactor;
    },

    componentDidUpdate() {
        this.resetScaleFactor();
    },

    render() {
        const { scaleFactor } = this.state;

        const containerStyle  = {
            display: 'flex',
            alignItems: 'center',
            height: '100vh',
            overflow: 'hidden'
        };

        const itemStyle = {
            backgroundColor: '#000',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            margin: 'auto',
            cursor: 'pointer',
            transition: 'transform .3s',
            transform: `scale( ${scaleFactor} )`
        };

        return (
            <div style={ containerStyle }>
                <span style={ itemStyle } onClick={ this.handleClick } />
            </div>
        );
    }
});

ReactDOM.render(
    <Clicker />,
    document.getElementById('root')
);
