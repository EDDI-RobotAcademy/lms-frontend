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
                  <li
                    v-for="day in calendarDays"
                    :key="day.date"
                    :class="{
                      inactive: !day.isCurrentMonth,
                      active: isToday(day.date),
                      checked: isChecked(day.date)
                    }"
                  >
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
import axios from 'axios';
const authenticationModule = 'authenticationModule'

export default {
  data() {
    return {
      dialog: true,
      currentDate: new Date(),
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      direction: 'next',
      attendance: [], // 출석 체크한 날짜를 저장
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
      const remainingDays = 42 - calendarDays.length;
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month + 1, i);
        calendarDays.push({ date, isCurrentMonth: false });
      }

      return calendarDays;
    },
  },
  mounted() {
    // 로컬 스토리지에서 출석 체크한 날짜를 가져옴
    this.attendance = JSON.parse(localStorage.getItem('attendance')) || [];
  },
  methods: {
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
      // 출석 체크한 날짜인지 확인
      return this.attendance.includes(this.formatDate(date));
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    checkAttendance() {
      this.requestRedisAddAttendanceCherryToDjango(this.userToken, this.attendancecherry)
    },
    // checkAttendance() {
    //   const today = this.formatDate(new Date());
    //   if (this.attendance.includes(today)) {
    //     alert('이미 오늘 출석 체크를 완료하셨습니다.');
    //     return;
    //   }
    //   this.attendance.push(today);
    //   localStorage.setItem('attendance', JSON.stringify(this.attendance));
    //   alert('출석 체크가 완료되었습니다!');
    //   this.closeDialog();
    // },
    closeDialog() {
      this.dialog = false;
      this.$emit('close');
    },
  },
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
  height: 320px; /* Adjust this value based on your calendar's height */
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
  background: rgba(252, 118, 134, 0.1); /* 이미 체크한 날의 배경 색상 */
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
