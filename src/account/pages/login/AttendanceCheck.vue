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
            <div class="calendar">
              <ul class="weeks">
                <li v-for="day in weekDays" :key="day">{{ day }}</li>
              </ul>
              <ul class="days">
                <li
                  v-for="day in calendarDays"
                  :key="day.date"
                  :class="{
                    inactive: !day.isCurrentMonth,
                    active: isToday(day.date)
                  }"
                  @click="selectDate(day.date)"
                >
                  {{ day.date.getDate() }}
                </li>
              </ul>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn id="Attendance-check-botton" color="white" @click="checkAttendance">🍒 수령완료</v-btn>
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
export default {
  data() {
    return {
      dialog: true,
      currentDate: new Date(),
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      selectedDate: null,
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
  methods: {
    changeMonth(delta) {
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
    selectDate(date) {
      this.selectedDate = date;
      console.log('Selected date:', date);
      // 여기에 날짜 선택 로직을 추가할 수 있습니다.
    },
    closeDialog() {
      this.dialog = false;
      this.$emit('close');
    },
    checkAttendance() {
      if (this.selectedDate) {
        console.log('Checking attendance for:', this.selectedDate);
        // 여기에 출석체크 로직을 추가할 수 있습니다.
        this.closeDialog();
      } else {
        alert('날짜를 선택해주세요.');
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

/* Attendance-check-dialog 스타일 추가 */
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
  cursor: pointer;
}


/* 이번 달 날짜가 아닌 숫자들에 대한 색 */
.days li.inactive {
  color: #0c0c0c1a;
}


.days li.active {
  color: #fff;
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


/* 선택 중인 요일에 대한 색표현 */
.days li.active::before {
  background: rgb(252, 118, 134);
}
/* rgb(189, 0, 22); */

/* 출석체크 버튼 버전-1 */
#Attendance-check-botton {
  font-size: 1.5rem;
  font-style: calc();
  width: 180px;
  height: 60px;
  border-radius: 13px;
  background: rgb(252, 118, 134);
  
}


/* 출석체크 버튼 버전-2 */
/* #Attendance-check-botton {
  font-size: 1.5rem;
  border-width: 3.5px;
  border-color: rgb(189, 0, 22);
  width: 150px;
  height: 80px;
  border-radius: 30px;
} */
</style>