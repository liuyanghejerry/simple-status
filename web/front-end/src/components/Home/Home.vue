<template>
  <div class="home">
    <header>
      <h2>Simple Status</h2>
    </header>

    <summary>
      <div class="item">
        <div>All Systems Operational</div>
        <div>Refreshed 24 minutes ago</div>
      </div>
    </summary>

    <div class="metric-list">
      <div class="item">
        <div>Website</div>
        <div>Operational</div>
      </div>
      <div class="item">
        <div>Website</div>
        <div>Operational</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
};
</script>

<style lang="less" scoped>
.home {
  width: 980px;
  margin: 40px auto;

  header {
    margin-bottom: 70px;
    h2 {
      font-size: 4rem;
      font-weight: normal;
    }
  }

  .item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: .75rem 1.25rem;
    font-size: 1.2rem;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
  }

  summary {
    margin-bottom: 70px;
    .item {
      font-weight: 500;
      text-shadow: 0 1px 0 rgba(0,0,0,0.1);
      border: 1px solid rgba(0,0,0,0.1);
      color: #fff;
      background-color: #2fcc66;
    }
  }

  .metric-list {
    .item:not(:first-of-type) {
      border-top: none;
      border-radius: 0;
    }
    .item:first-of-type {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
    .item:last-of-type {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
}
</style>
