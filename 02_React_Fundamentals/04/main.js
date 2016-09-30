const COLORS = ['#FD8A81', '#FED085', '#FFFE94', '#CFD8DC', '#84D8FD', '#AAFEEB', '#CDFD95'];

const Note = React.createClass({
    handleDelete() {
        this.props.onDelete(this.props.id);
    },

    render() {
        const {
            color,
            children,
            onDelete
        } = this.props;

        return (
            <div className="note" style={{ backgroundColor: color }}>
                <span className="note__delete-icon" onClick={this.handleDelete}> × </span>
                {children}
            </div>
        );
    }
});

const NoteEditor = React.createClass({
    getInitialState() {
        return {
            text: '',
            color: COLORS[0]
        };
    },

    handleTextChange(event) {
        this.setState({
            text: event.target.value
        });
    },

    handleColorChange(color){
        this.setState({ color });
    },

    handleNoteAdd() {
        const newNote = {
            text: this.state.text,
            color: this.state.color,
            id: Date.now()
        };

        this.props.onNoteAdd(newNote);

        this.resetState();
    },

    resetState() {
        this.setState({
            text: '',
            color: COLORS[0]
        });
    },

    render() {
        const {
            text,
            color
        } = this.state;

        return (
            <div className="editor">
                <textarea
                    rows={5}
                    placeholder="Enter your note here..."
                    className="editor__textarea"
                    value={text}
                    onChange={this.handleTextChange}
                />

                <div className="editor__footer">
                    <NotesColors
                        onColorChange={this.handleColorChange}
                        activeColor={color}
                    />

                    <button className="editor__button" onClick={this.handleNoteAdd}>Add</button>
                </div>
            </div>
        );
    }
});

const NotesGrid = React.createClass({
    componentDidMount() {
        const grid = this.grid;

        this.msnry = new Masonry(grid, {
            columnWidth: 240,
            gutter: 10,
            isFitWidth: true
        });
    },

    componentDidUpdate(prevProps) {
        if (this.props.notes.length !== prevProps.notes.length) {
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },

    render() {
        const {
            notes,
            onNoteDelete
        } = this.props;

        return (
            <div className="grid" ref={c => this.grid = c}>
                {
                    notes.map(note =>
                        <Note
                            key={note.id}
                            id={note.id}
                            color={note.color}
                            onDelete={onNoteDelete}
                        >
                            {note.text}
                        </Note>
                    )
                }
            </div>
        );
    }
});

const NotesColors = React.createClass({
    getInitialState() {
        return {
            activeColor: ''
        };
    },

    handleClick(color) {
        this.setState({
            activeColor: color
        });

        this.props.onColorChange(color);
    },

    componentWillReceiveProps(nextProps) {
        this.setState({
            activeColor: nextProps.activeColor
        });
    },

    render() {
        const { activeColor } = this.state;

        return (
            <div className="notes__palette">
                {
                    COLORS.map(color =>
                        <div
                            key={color}
                            className={activeColor === color ? 'active color' : 'color'}
                            style={{ background: color }}
                            onClick={this.handleClick.bind(null, color)}
                        />
                    )
                }
            </div>
        );
    }
});

const NotesApp = React.createClass({
    getInitialState() {
        return {
            notes: []
        };
    },

    componentDidMount() {
        const savedNotes = JSON.parse(localStorage.getItem('notes'));

        if (savedNotes) {
            this.setState({ notes: savedNotes });
        }
    },

    componentDidUpdate() {
        const notes = JSON.stringify(this.state.notes);

        localStorage.setItem('notes', notes);
    },

    handleNoteDelete(noteId) {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        });
    },

    handleNoteAdd(newNote) {
        this.setState({
            notes: [newNote, ...this.state.notes]
        });
    },

    render() {
        return (
            <div className="app">
                <h2 className="app__header">NotesApp</h2>

                <NoteEditor onNoteAdd={this.handleNoteAdd} />

                <NotesGrid
                    notes={this.state.notes}
                    onNoteDelete={this.handleNoteDelete}
                />
            </div>
        );
    }
});

ReactDOM.render(
    <NotesApp />,
    document.getElementById('root')
);
