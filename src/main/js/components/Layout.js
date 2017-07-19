import React from 'react';

export const ContentPanel = ({ children }) => <div className='content-panel'>{children}</div>;

const Layout = (props) => (
  <div>
    {props.nav}
    <div className='nav-divider' />
    {props.children}
  </div>
);

const Filler = (props) => <div className='filler' />;

export class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: props.active };
    this.selectCallback = props.onSelect ? props.onSelect.bind(this) : () => { };
  }

  selectTab(name, e) {
    this.setState({active: name});
    this.selectCallback(name, e);
  }

  render() {
    const tabs = this.props.tabs.map((t) => {
      const className = t.id == this.state.active ? 'tab active' : 'tab';
      return <div className={className} key={t.name} onClick={(e) => this.selectTab(t.id, e)}><h5>{t.name}</h5></div>
    });

    const active = this.props.tabs.find((t) => t.id === this.state.active);
    const content = active ? active.content : this.props.tabs[0].content;
    const className = this.props.padding ? 'flex-panel ' : 'flex-panel-fluid';

    return (<div>
      <div className='flex-tabs'>
        {tabs}
        <Filler/>
      </div>
      <div className={`${className} flex-tab-content`}>
        {content}
      </div>
    </div>);
  }
}

export const ContentBox = ({ children, title }) => (<div className='content-box'>
  <h3 className='content-box-title'>{title}</h3>
  {children}
</div>);

export const TwoColumnLayout = (props) => (<div className='two-column-flex'>
  <div className='main-column'>{props.left}</div>
  <div className='small-column'>{props.right}</div>
</div>);

export default Layout;

