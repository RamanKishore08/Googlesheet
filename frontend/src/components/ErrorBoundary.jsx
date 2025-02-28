import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    if (this.state.hasError) {
      return <h4 style={{ color: "red" }}>Error: {this.state.errorMessage}</h4>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
