import { Text, View } from "react-native";
import { FunctionComponent } from 'react';
import { PieChart } from "react-native-gifted-charts";
import Scoreboard from "../Scoreboard";
import { Medium } from "../Layout";
export interface SettingsParams {
  username?: string,
  mediums: Medium[],
  cardsPerDay: number,
}
class StatCategory {
  label: string = "";
  value: number = 0;
  color: string = "";
  color2: string = ""; // second color in case of gradient

  constructor(label: string, value: number, color: string, gradientCenterColor: string = "#FFFFFF") {
    this.label = label;
    this.value = value;
    this.color = color;
    this.color2 = gradientCenterColor;
  }
}

/**
 * Statistics view  
 */
export const StatisticsView: FunctionComponent<SettingsParams> = ({ mediums, cardsPerDay, username }) => {

  let title = "Your Progress:";
  let learned = new StatCategory("learned", 47, "#93FCF8", "#3BE9DE");
  let learning = new StatCategory("learning", 20, "#009FFF", "#006DFF");
  let relearn = new StatCategory("relearn", 10, "#BDB2FA", "#8F80F3");
  let todo = new StatCategory("todo", 23, "#FFA5BA", "#FF7F97");

  const pieData = [
    {
      value: learned.value,
      color: learned.color,
      gradientCenterColor: learned.color2,
      focused: true,
    },
    { value: learning.value, color: learning.color, gradientCenterColor: learning.color2 },
    { value: relearn.value, color: relearn.color, gradientCenterColor: relearn.color2 },
    { value: todo.value, color: todo.color, gradientCenterColor: todo.color2 },
  ];

  function renderDot(color: string) {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  function renderLegendComponent() {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 120,
              marginRight: 20,
            }}>
            {renderDot(learned.color)}
            <Text style={{ color: 'white' }}>{learned.label}: {learned.value}%</Text>
          </View>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
            {renderDot(relearn.color)}
            <Text style={{ color: 'white' }}>{relearn.label}: {relearn.value}%</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 120,
              marginRight: 20,
            }}>
            {renderDot(learning.color)}
            <Text style={{ color: 'white' }}>{learning.label}: {learning.value}%</Text>
          </View>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
            {renderDot(todo.color)}
            <Text style={{ color: 'white' }}>{todo.label}: {todo.value}%</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <View
      style={{
        paddingVertical: 20,
        backgroundColor: '#34448B',
        flex: 1,
      }}>
      <View
        style={{
          margin: 20,
          padding: 16,
          borderRadius: 20,
          backgroundColor: '#232B5D',
        }}>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          {title}
        </Text>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <PieChart
            data={pieData}
            donut
            showGradient
            sectionAutoFocus
            radius={90}
            innerRadius={60}
            innerCircleColor={'#232B5D'}
            centerLabelComponent={() => {
              return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text
                    style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
                    {learned.value}%
                  </Text>
                  <Text style={{ fontSize: 14, color: 'white' }}>{learned.label}</Text>
                </View>
              );
            }}
          />
        </View>
        {renderLegendComponent()}
      </View>
      <Scoreboard />
    </View>
  );

};