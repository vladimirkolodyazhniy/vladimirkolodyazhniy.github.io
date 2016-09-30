const Article = React.createClass({
    getInitialState() {
        return {
            collapsed: false
        };
    },

    handleDelete() {
        this.props.onDelete(this.props.id);
    },

    handleCollapse() {
        this.setState({
            collapsed : !this.state.collapsed
        });
    },

    render() {
        const {
            title,
            text,
            onDelete
        } = this.props;

        const { collapsed } = this.state;

        return (
            <div className="article">
                <span className="article__delete-icon" onClick={this.handleDelete}> × </span>

                <div
                    dangerouslySetInnerHTML={{ __html: title }}
                    onClick={this.handleCollapse}
                    className={collapsed ? "article__title collapsed" : "article__title" }
                />

                <div className={collapsed ? "content collapsed" : "content" } dangerouslySetInnerHTML={{ __html: text }} />
            </div>
        );
    }
});

const ArticleEditor = React.createClass({
    getInitialState() {
        return {
            title: '',
            compiledTitle: '',
            text: '',
            compiledText: ''
        };
    },

    handleTextChange(event) {
        this.setState({
            text: event.target.value,
            compiledText: this.md.render(event.target.value)
        });
    },

    handleTitleChange(event) {
        this.setState({
            title: event.target.value,
            compiledTitle: this.md.render(event.target.value)
        });
    },

    handleArticleAdd() {
        const newArticle = {
            title: this.state.compiledTitle,
            text: this.state.compiledText,
            id: Date.now()
        };

        this.props.onArticleAdd(newArticle);

        this.resetState();
    },

    resetState() {
        this.setState({
            title: '',
            compiledTitle: '',
            text: '',
            compiledText: ''
        });
    },

    componentDidMount() {
        const textarea = this.textarea;

        this.md = new Remarkable('full');
    },

    render() {
        const {
            title,
            compiledTitle,
            compiledText,
            text
        } = this.state;

        return (
            <div className="editor__holder">
                <div className="editor">
                    <input
                        type="text"
                        className="editor__input"
                        placeholder="Enter your article title here..."
                        value={title}
                        onChange={this.handleTitleChange}
                    />

                    <textarea
                        rows={5}
                        placeholder="Enter your text here..."
                        className="editor__textarea"
                        value={text}
                        onChange={this.handleTextChange}
                        ref={c => this.textarea = c}
                    />

                    <div className="editor__footer">
                        <button className="editor__button" onClick={this.handleArticleAdd}>Publish</button>
                    </div>
                </div>

                <div className="preview">
                    <div dangerouslySetInnerHTML={{ __html: compiledTitle }} />

                    <div dangerouslySetInnerHTML={{ __html: compiledText }} />
                </div>
            </div>
        );
    }
});

const ArticlesGrid = React.createClass({
    render() {
        const {
            articles,
            onArticleDelete
        } = this.props;

        return (
            <div className="grid">
                {
                    articles.map(article =>
                        <Article
                            key={article.id}
                            id={article.id}
                            onDelete={onArticleDelete}
                            title={article.title}
                            text={article.text}
                        />
                    )
                }
            </div>
        );
    }
});

const BlogApp = React.createClass({
    getInitialState() {
        return {
            articles: []
        };
    },

    componentDidMount() {
        const savedArticles = JSON.parse(localStorage.getItem('articles'));

        if (savedArticles) {
            this.setState({ articles: savedArticles });
        }
    },

    componentDidUpdate() {
        const articles = JSON.stringify(this.state.articles);

        localStorage.setItem('articles', articles);
    },

    handleArticleDelete(articleId) {
        this.setState({
            articles: this.state.articles.filter(article => article.id !== articleId)
        });
    },

    handleArticleAdd(newArticle) {
        this.setState({
            articles: [newArticle, ...this.state.articles]
        });
    },

    render() {
        return (
            <div className="app">
                <h2 className="app__header">Blog App</h2>
                <small className="app__descr">This editor supports markdown convertation to HTML. The parsing rules are responsible for separating markdown syntax from plain text.</small>

                <ArticleEditor onArticleAdd={this.handleArticleAdd} />

                <ArticlesGrid
                    articles={this.state.articles}
                    onArticleDelete={this.handleArticleDelete}
                />
            </div>
        );
    }
});

ReactDOM.render(
    <BlogApp />,
    document.getElementById('root')
);
