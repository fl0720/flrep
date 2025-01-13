<template>
    <div class="nodata">
        <img src="@/assets/nodata.png" alt="" srcset="">
        <div style="color: #9BA3AF;">暂无数据</div>
    </div>
</template>
  
<script>
export default {
    name: 'NoData',
    props: {
        msg: String
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.nodata {
    background: #FCFCFC;
    border-radius: 6px;
    margin: 10px 12px;
    padding: 30px 0;
}
</style>
  