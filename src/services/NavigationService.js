class NavigationService {
  history;

  setHistoryRef = (historyRef) => {
    this.history = historyRef;
  };
}

export default new NavigationService();
