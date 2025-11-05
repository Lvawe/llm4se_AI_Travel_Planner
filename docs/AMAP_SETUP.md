# 高德地图 API 配置指南

## 1. 获取高德地图 API Key

### 步骤：

1. 访问高德开放平台：https://lbs.amap.com/
2. 注册并登录账号
3. 进入控制台 → 应用管理 → 我的应用
4. 创建新应用
5. 添加 Key，选择"Web端(JS API)"
6. 设置服务平台为 "Web端(JS API)"

### 配置到项目：

在 `frontend/.env.local` 文件中添加：

```env
NEXT_PUBLIC_AMAP_KEY=your_amap_key_here
```

## 2. API 功能说明

### 已集成功能：

- ✅ 地图显示（2D/3D视图）
- ✅ 地理编码（地址 → 经纬度）
- ✅ 标记点（Marker）
- ✅ 信息窗口（InfoWindow）

### 待集成功能：

- 🔄 路线规划（驾车/步行/公交）
- 🔄 周边搜索（POI搜索）
- 🔄 实时路况
- 🔄 行政区域查询

## 3. 使用示例

```tsx
import AmapComponent from '@/components/AmapComponent'

// 在组件中使用
<AmapComponent destination="北京天安门" />
```

## 4. 注意事项

- Key 必须添加到环境变量中
- 确保域名已添加到高德平台的白名单
- 开发环境可以使用 localhost
- 生产环境需要配置实际域名

## 5. 相关文档

- 高德地图 JS API 文档：https://lbs.amap.com/api/javascript-api/summary
- 示例中心：https://lbs.amap.com/demo/javascript-api/example/map/map-show
