import React from "react";

export default class AutoRefresh extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1000,
      autoRefresh: false,
    };
    this.autoRefresh = null;
  }

  componentDidMount = () => {
    if (this.props.noautorefresh === true) {
      return;
    }
    this.autoRefresh = setInterval(() => {
      this.setState((prevState, props) => {
        return {
          ...prevState,
          autoRefresh: !prevState.autoRefresh,
        };
      });
      try {
        this.props.onclick();
      } catch (e) {
        console.log(e);
      }
    }, [this.props.count || this.state.count]);
  };

  componentWillUnmount = () => {
    if (this.props.noautorefresh === true) {
      return;
    }
    clearInterval(this.autoRefresh);
  };

  render() {
    const updateChildrenWithProps = React.Children.map(
      this.props.children,
      (child, _) => {
        return React.cloneElement(child, {
          // ...this.props
          autoRefresh: this.state.autoRefresh
        });
      }
    );
    console.log(updateChildrenWithProps);
    return updateChildrenWithProps;
  }
}
