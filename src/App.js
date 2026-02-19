import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SurahList from "./components/Quran/SurahList";
import SurahDetail from "./components/Quran/SurahDetail";
import Home from "./components/Home";
import Dua from "./components/Dua";
import QiblaCompass from "./components/Qibla/QiblaCompass";
import Hadith from "./components/Hadith";
import Tracker from "./components/Tracker";
import Tasbih from "./components/Tasbih";

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/quran" component={SurahList} />
          <Route path="/quran/:id" component={SurahDetail} />
          <Route path="/dua" component={Dua} />
          <Route path="/tasbih" component={Tasbih} />
          <Route path="/qibla" component={QiblaCompass} />
          <Route path="/hadith" component={Hadith} />
          <Route path="/tracker" component={Tracker}/>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;