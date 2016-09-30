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
                    className={collapsed ? "article__title collapsed" : "article__title" }
                    onClick={this.handleCollapse}
                >
                    <Markdown sourceText={title}/>
                </div>

                <div className={collapsed ? "content collapsed" : "content" }>
                    <Markdown sourceText={text}/>
                </div>
            </div>
        );
    }
});

const Markdown = React.createClass({

    content() {
        if (this.props.sourceText) {
            return <div dangerouslySetInnerHTML={{ __html: this.renderMarkdown(this.props.sourceText) }} />;
        }
    },

    renderMarkdown(source) {
        if (!this.md) {
            this.md = new Remarkable('full');
        }

        return this.md.render(source);
    },

    render() {
        return (
            <div>
                {this.content()}
            </div>
        );
    }
});

const ArticleEditor = React.createClass({
    getInitialState() {
        return {
            title: '',
            text: ''
        };
    },

    handleTextChange(event) {
        this.setState({
            text: event.target.value
        });
    },

    handleTitleChange(event) {
        this.setState({
            title: event.target.value
        });
    },

    handleArticleAdd() {
        const newArticle = {
            title: this.state.title,
            text: this.state.text,
            id: Date.now()
        };

        this.props.onArticleAdd(newArticle);

        this.resetState();
    },

    resetState() {
        this.setState({
            title: '',
            text: ''
        });
    },

    render() {
        const {
            title,
            text
        } = this.state;
        console.log(title, text);

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
                    />

                    <div className="editor__footer">
                        <button className="editor__button" onClick={this.handleArticleAdd}>Publish</button>
                    </div>
                </div>

                <div className="preview">
                    <div className="content-holder">
                        <Markdown sourceText={title}/>

                        <Markdown sourceText={text}/>
                    </div>
                </div>
            </div>
        );
    }
});

const ArticlesList = React.createClass({
    render() {
        const {
            articles,
            onArticleDelete
        } = this.props;

        return (
            <div className="list">
                {
                    articles.map(article =>
                        <Article
                            key={article.id}
                            id={article.id}
                            title={article.title}
                            text={article.text}
                            onDelete={onArticleDelete}
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

                <ArticlesList
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
