<template>
  <div>
    <v-dialog class="Attendance-check-dialog" v-model="dialog" max-width="600px" max-height="1000px" persistent>
      <v-card>
        <v-card-title class="headline">
          출석현황
        </v-card-title>
        <v-card-text>
          <div class="wrapper">
            <header>
              <div class="nav">
                <v-btn icon @click="changeMonth(-1)">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <p class="current-date">{{ currentMonthYear }}</p>
                <v-btn icon @click="changeMonth(1)">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </header>
            <transition-group name="calendar" tag="div" class="calendar-container">
              <div :key="currentMonthYear" class="calendar" :data-direction="direction">
                <ul class="weeks">
                  <li v-for="day in weekDays" :key="day">{{ day }}</li>
                </ul>
                <ul class="days">
                  <li v-for="day in calendarDays" :key="day.date" :class="{
                    inactive: !day.isCurrentMonth,
                    active: isToday(day.date),
                    checked: isChecked(day.date)
                  }">
                    {{ day.date.getDate() }}
                  </li>
                </ul>
              </div>
            </transition-group>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn id="Attendance-check-botton" color="white" @click="checkAttendance">🍒 수령하기</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">X 닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import axios from 'axios';
const accountModule = 'accountModule'
const authenticationModule = 'authenticationModule'

export default {
  data() {
    return {
      attendancecherry: 0,
      dialog: true,
      currentDate: new Date(),
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      direction: 'next',
      attendance: [], // 출석 체크한 날짜를 저장
      userToken: localStorage.getItem("userToken")
    };
  },
  computed: {
    currentMonthYear() {
      return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    },
    calendarDays() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDay = firstDay.getDay();

      const calendarDays = [];

      // Previous month's days
      for (let i = startingDay - 1; i >= 0; i--) {
        const date = new Date(year, month, -i);
        calendarDays.push({ date, isCurrentMonth: false });
      }

      // Current month's days
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        calendarDays.push({ date, isCurrentMonth: true });
      }

      // Next month's days
      const remainingDays = 31 - calendarDays.length;
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month + 1, i);
        calendarDays.push({ date, isCurrentMonth: false });
      }

      return calendarDays;
    },
  },
  mounted() {
    // 로컬 스토리지에서 출석 체크한 날짜를 가져옴
    this.fetchAttendanceDateList()
  },
  methods: {
    ...mapActions(authenticationModule, ['requestRedisAddAttendanceCherryToDjango']),
    ...mapActions(accountModule, ['requestRedisGetAttendanceDateListToDjango', 'requestRedisUpdateAttendanceDateListToDjango']),
    // mounted에서 호출하기 위한 함수 정의
    async fetchAttendanceDateList() {
      const request = { usertoken: this.userToken }
      const data = await this.requestRedisGetAttendanceDateListToDjango(request)
      this.attendance = data
    },
    changeMonth(delta) {
      this.direction = delta > 0 ? 'next' : 'prev';
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + delta,
        1
      );
    },
    isToday(date) {
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    },
    isChecked(date) {
      date = date.getDate()
      // 모든 날짜 출석 여부 확인 로직
      if(this.attendance[date - 1] > 0){
        return true
      } else {
        return false
      }

    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    checkAttendance() {
      console.log('today:', this.currentDate.getDate())
      if (this.attendance[this.currentDate.getDate() - 1] > 0) {
        alert('이미 오늘 출석 체크를 완료하였습니다.')
        this.closeDialog()
      }
      else {
        //출석체크 버튼 클릭시 DB 업데이트 로직

        //출석체크 클릭시 해당 날짜 체크
        this.attendance[this.currentDate.getDate() - 1]++
        console.log('전달 전 출석부:', this.attendance)
        //django로 전달하기 전의 데이터 정의 부분
        //const attInfo = {
        //  usertoken: this.userToken
        //}
        //this.requestRedisAddAttendanceCherryToDjango(attInfo)

        //TODO: 출석 시 과거 출석 List 업데이트 필요.
        const updateInfo = {
          usertoken: this.userToken,
          today: this.currentDate.getDate()
        }
        console.log('2차 정보 업데이트용 데이터', updateInfo)
        const data = this.requestRedisUpdateAttendanceDateListToDjango(updateInfo)
        console.log(data)
      }
    },
    closeDialog() {
      this.dialog = false;
      this.$emit('close');
    },
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

.Attendance-check-dialog .v-card {
  border: 4px solid rgb(252, 118, 134);
  border-radius: 20px !important;
  overflow: hidden;
}

.wrapper {
  width: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
}

.wrapper .nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.wrapper .nav .current-date {
  font-size: 20px;
  font-weight: 600;
}

.calendar-container {
  position: relative;
  overflow: hidden;
  height: 320px;
  /* Adjust this value based on your calendar's height */
}

.calendar {
  position: absolute;
  width: 100%;
  transition: all 0.3s ease;
}

.calendar ul {
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  text-align: center;
}

.calendar .weeks li {
  font-weight: 500;
}

.calendar .days {
  margin-bottom: 20px;
}

.calendar ul li {
  width: calc(100% / 7);
  position: relative;
  padding: 5px 0;
}

.calendar .days li {
  z-index: 1;
}

.days li.inactive {
  color: #0c0c0c1a;
}

.days li.active {
  color: #fff;
}

.days li.checked {
  background: rgba(252, 118, 134, 0.1);
  /* 이미 체크한 날의 배경 색상 */
  border-radius: 50%;
}

.calendar .days li::before {
  position: absolute;
  content: '';
  height: 30px;
  width: 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  z-index: -1;
}

.days li:hover::before {
  background: #f2f2f2;
}

.days li.active::before {
  background: rgb(252, 118, 134);
}

#Attendance-check-botton {
  font-size: 1.5rem;
  width: 180px;
  height: 60px;
  border-radius: 13px;
  background: rgb(252, 118, 134);
  color: white;
}

.calendar-enter-active,
.calendar-leave-active {
  transition: all 0.3s ease;
}

.calendar-enter-from[data-direction="next"] {
  transform: translateX(100%);
}

.calendar-leave-to[data-direction="next"] {
  transform: translateX(-100%);
}

.calendar-enter-from[data-direction="prev"] {
  transform: translateX(-100%);
}

.calendar-leave-to[data-direction="prev"] {
  transform: translateX(100%);
}

.calendar-move {
  transition: transform 0.3s ease;
}
</style>
