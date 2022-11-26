import {
  CircularProgress,
  makeStyles,
  ThemeProvider,
  Typography,
  unstable_createMuiStrictModeTheme,
} from "@material-ui/core";
import axios from "axios";
import React, { Children, useEffect, useState } from "react";
import CryptoState from "../context/CryptoContext";
import { HistoricalChart } from "../config/api";
import { Line } from "react-chartjs-2";
import { chartDays } from "../config/data";
import SelectButton from "./SelectedButton";
import Chart from "chart.js/auto";

const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState();
  const currency = CryptoState(Children);
  const [flag, setflag] = useState(false);
  const [days, setDays] = useState(1);

  const useStyles = makeStyles((theme) => ({
    container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
    },
  }));

  const classes = useStyles();
  let curr = currency.props.value.currency;
  console.log("currency : :", curr);
  const fetchHistoricData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, curr));
    setflag(true);
    setHistoricData(data.prices);
    console.log("data===", data);
  };

  useEffect(() => {
    fetchHistoricData();
  }, [days]);

  const darkTheme = unstable_createMuiStrictModeTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!historicData || flag === false ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historicData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: historicData.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days ) in ${currency}`,
                    borderColor: "#EEBC1D",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => {
                    setDays(day.value);
                    setflag(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
